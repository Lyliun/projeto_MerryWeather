import axios from 'axios';
import { cacheService } from './cache.service';
import { CACHE_CONFIG } from '../config/cache';
import {
  Coordinates,
  WeatherResponse,
  GeocodingResponse,
  OpenMeteoWeatherResponse,
} from '../types/weather.types';

/**
 * Serviço de previsão do tempo usando Open-Meteo API
 */
class WeatherService {
  private readonly GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
  private readonly WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

  private getWeatherDescription(code: number): string {
    const weatherCodes: { [key: number]: string } = {
      0: 'Céu limpo',
      1: 'Principalmente limpo',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Névoa',
      48: 'Névoa com geada',
      51: 'Garoa leve',
      53: 'Garoa moderada',
      55: 'Garoa densa',
      61: 'Chuva leve',
      63: 'Chuva moderada',
      65: 'Chuva forte',
      71: 'Neve leve',
      77: 'Granizo',
      80: 'Pancadas de chuva leves',
      95: 'Trovoada',
    };
    return weatherCodes[code] || 'Desconhecido';
  }

  /**
   * Obtém o nome da cidade e país a partir de coordenadas (Reverse Geocoding)
   */
  private async reverseGeocode(lat: number, lon: number): Promise<{ name: string; country: string }> {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat,
          lon,
          format: 'json',
          addressdetails: 1,
          accept_language: 'pt-BR'
        },
        headers: {
          'User-Agent': 'MerryWeatherApp/1.0' // Identificação necessária para a API
        },
        timeout: 5000,
      });

      const addr = response.data.address;
      // Tenta pegar a cidade, se não houver, tenta vila, bairro ou cidade/estado
      const cityName = addr.city || addr.town || addr.village || addr.suburb || addr.city_district || 'Local desconhecido';
      const countryName = addr.country || 'Brasil';

      return { name: cityName, country: countryName };
    } catch (error) {
      console.error('Erro no reverse geocoding:', error);
      return { name: 'Sua Localização', country: 'GPS' };
    }
  }

  /**
   * Obtém coordenadas a partir do nome da cidade
   */
  async getCoordinates(city: string): Promise<Coordinates> {
    const cacheKey = `geocoding:${city.toLowerCase().trim()}`;
    const cached = cacheService.get<Coordinates>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get<GeocodingResponse>(this.GEOCODING_API, {
        params: { name: city, count: 1, language: 'pt', format: 'json' },
        timeout: 5000,
      });

      if (!response.data.results || response.data.results.length === 0) {
        throw new Error(`Cidade "${city}" não encontrada`);
      }

      const result = response.data.results[0];
      const coordinates: Coordinates = {
        latitude: result.latitude,
        longitude: result.longitude,
        name: result.name,
        country: result.country,
      };

      cacheService.set(cacheKey, coordinates, CACHE_CONFIG.GEOCODING_TTL);
      return coordinates;
    } catch (error) {
      this.handleAxiosError(error, `buscar coordenadas de ${city}`);
      throw error;
    }
  }

  /**
   * Busca clima por nome da cidade
   */
  async getWeather(city: string): Promise<WeatherResponse> {
    const cacheKey = `weather:city:${city.toLowerCase().trim()}`;
    const cached = cacheService.get<WeatherResponse>(cacheKey);
    if (cached) return cached;

    const coords = await this.getCoordinates(city);
    const weatherData = await this.fetchFromOpenMeteo(coords);

    cacheService.set(cacheKey, weatherData, CACHE_CONFIG.WEATHER_TTL);
    return weatherData;
  }

  /**
   * Busca clima diretamente por Latitude e Longitude com identificação de nome
   */
  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherResponse> {
    const cacheKey = `weather:coords:${lat.toFixed(4)},${lon.toFixed(4)}`;
    const cached = cacheService.get<WeatherResponse>(cacheKey);
    if (cached) return cached;

    // Resolve o nome real da cidade antes de buscar o clima
    const locationInfo = await this.reverseGeocode(lat, lon);

    const coords: Coordinates = {
      latitude: lat,
      longitude: lon,
      name: locationInfo.name,
      country: locationInfo.country,
    };

    const weatherData = await this.fetchFromOpenMeteo(coords);
    
    cacheService.set(cacheKey, weatherData, CACHE_CONFIG.WEATHER_TTL);
    return weatherData;
  }

  /**
   * Método privado para centralizar a chamada à API do Open-Meteo
   */
  private async fetchFromOpenMeteo(coords: Coordinates): Promise<WeatherResponse> {
    try {
      const response = await axios.get<OpenMeteoWeatherResponse>(this.WEATHER_API, {
        params: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          current: 'temperature_2m,wind_speed_10m,weather_code',
          daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max',
          timezone: 'auto',
          forecast_days: 7,
        },
        timeout: 5000,
      });

      const { current, daily } = response.data;

      return {
        location: coords,
        current: {
          temperature: Math.round(current.temperature_2m),
          windSpeed: Math.round(current.wind_speed_10m),
          weatherCode: current.weather_code,
          weatherDescription: this.getWeatherDescription(current.weather_code),
          time: current.time,
        },
        forecast: daily.time.map((date, index) => ({
          date,
          maxTemp: Math.round(daily.temperature_2m_max[index]),
          minTemp: Math.round(daily.temperature_2m_min[index]),
          weatherCode: daily.weather_code[index],
          weatherDescription: this.getWeatherDescription(daily.weather_code[index]),
          precipitation: Math.round(daily.precipitation_sum[index] * 10) / 10,
          windSpeed: Math.round(daily.wind_speed_10m_max[index]),
        })),
      };
    } catch (error) {
      this.handleAxiosError(error, 'buscar dados meteorológicos');
      throw error;
    }
  }

  private handleAxiosError(error: any, context: string) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') throw new Error(`Timeout ao ${context}`);
      if (error.response?.status === 429) throw new Error('Muitas requisições. Tente mais tarde.');
      throw new Error(`Erro ao ${context}: ${error.message}`);
    }
  }

  getServiceInfo() {
    return {
      service: 'Open-Meteo API',
      cache: {
        weatherTTL: `${CACHE_CONFIG.WEATHER_TTL / 60}min`,
        geocodingTTL: `${CACHE_CONFIG.GEOCODING_TTL / 3600}h`,
      },
    };
  }
}

export const weatherService = new WeatherService();