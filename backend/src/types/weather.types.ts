export interface Coordinates {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
}

export interface GeocodingResponse {
  results?: Array<{
    latitude: number;
    longitude: number;
    name: string;
    country: string;
    admin1?: string;
  }>;
}

export interface OpenMeteoWeatherResponse {
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    time: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
  };
}

export interface WeatherResponse {
  location: Coordinates;
  current: {
    temperature: number;
    windSpeed: number;
    weatherCode: number;
    weatherDescription: string;
    time: string;
  };
  forecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    weatherCode: number;
    weatherDescription: string;
    precipitation: number;
    windSpeed: number;
  }>;
}
