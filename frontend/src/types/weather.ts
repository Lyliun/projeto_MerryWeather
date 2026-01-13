export interface WeatherData {
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
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

export interface ApiResponse {
  success: boolean;
  data: WeatherData;
  message?: string;
}
