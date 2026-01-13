import axios from 'axios';
import type { ApiResponse } from '../types/weather';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

export const weatherService = {
  getWeatherByCity: async (city: string): Promise<ApiResponse> => {
    const response = await api.get<ApiResponse>(`/weather/${city}`);
    return response.data;
  },

  // Chamada para a nova rota de coordenadas que criamos no backend
  getWeatherByCoords: async (lat: number, lon: number): Promise<ApiResponse> => {
    const response = await api.get<ApiResponse>(`/weather/search/coords`, {
      params: { lat, lon } // Envia como ?lat=X&lon=Y
    });
    return response.data;
  }
};