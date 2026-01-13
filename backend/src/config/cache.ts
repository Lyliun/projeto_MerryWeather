// src/config/cache.ts
import dotenv from 'dotenv'
dotenv.config();

export const CACHE_CONFIG = {
  CHECK_PERIOD: Number(process.env.CHECK_PERIOD) || 120,
  WEATHER_TTL: Number(process.env.WEATHER_TTL) || 600,
  GEOCODING_TTL: Number(process.env.GEOCODING_TTL) || 3600,
};