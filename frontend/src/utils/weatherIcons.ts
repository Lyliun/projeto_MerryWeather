export const getWeatherIcon = (code: number): string => {
  if (code === 0) return '☀️'; // Céu limpo
  if (code <= 3) return '☁️';  // Nublado
  if (code >= 51 && code <= 67) return '🌧️'; // Chuva
  if (code >= 71 && code <= 77) return '❄️'; // Neve
  if (code >= 95) return '⚡'; // Trovoada
  return '🌡️';
};