import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { weatherService } from './services/api';
import type { WeatherData } from './types/weather';
import { SearchBar } from './components/SearchBar';
import { RainEffect } from './components/RainEffect';
import { getWeatherIcon } from './utils/weatherIcons';

import './App.css';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Função de busca para Cidade (string) ou Coordenadas (objeto)
  const handleSearch = useCallback(async (query: string | { lat: number; lon: number }) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      
      if (typeof query === 'string') {
        if (!query.trim()) return;
        response = await weatherService.getWeatherByCity(query);
      } else {
        // Agora o weatherService reconhece este método após nossos ajustes no api.ts
        response = await weatherService.getWeatherByCoords(query.lat, query.lon);
      }

      if (response.success) {
        setWeather(response.data);
        document.title = `MerryWeather - ${response.data.location.name}`;
      } else {
        setError(typeof query === 'string' 
          ? `O lugar "${query}" não foi localizado. Tente novamente.` 
          : "Não conseguimos obter o clima para sua localização atual.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro na API');
      } else {
        setError('Erro ao conectar ao servidor. Verifique sua conexão.');
      }
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. useEffect com lógica de Geolocalização automática ao iniciar
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleSearch({ lat: latitude, lon: longitude });
        },
        (geoError) => {
          console.warn("Geolocalização negada ou falhou:", geoError.message);
          // Fallback para Londres (ou sua cidade preferida) caso o usuário negue
          handleSearch('Londres');
        },
        { timeout: 10000 }
      );
    } else {
      handleSearch('Londres');
    }
  }, [handleSearch]);

  const getThemeClass = (code: number | string | undefined) => {
    if (code === undefined) return 'theme-default';
    const numericCode = Number(code);
    if (numericCode === 0) return 'theme-clear'; 
    if (numericCode <= 3) return 'theme-cloudy'; 
    if (numericCode >= 51 && numericCode <= 67) return 'theme-rain'; 
    if (numericCode >= 95) return 'theme-storm'; 
    return 'theme-default';
  };

  const themeClass = getThemeClass(weather?.current.weatherCode);

  return (
    <div className={`app-container ${themeClass}`}>
      {themeClass === 'theme-rain' && <RainEffect />}

      <div style={containerStyle}>
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        > 
          <h1 className="logo-text">
            MERRY<span className="accent-red">WEATHER</span>
          </h1>
        </motion.header>

        <SearchBar onSearch={handleSearch} disabled={loading} />

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={errorStyle}
            >
              <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>⚠️</span>
              {error}
            </motion.div>
          )}

          {loading && (
            <motion.div 
              key="loader"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={loaderStyle}
            />
          )}

          {weather && !loading && (
            <motion.main 
              key={weather.location.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={cardStyle}
            >
              <div style={topRowStyle}>
                <div style={{ textAlign: 'left' }}>
                  <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{weather.location.name}</h2>
                  <span style={{ color: '#a78bfa', fontSize: '0.9rem' }}>{weather.location.country}</span>
                </div>
                <div style={iconBadgeStyle}>{getWeatherIcon(weather.current.weatherCode)}</div>
              </div>

              <div style={mainTempStyle}>
                <span style={tempNumberStyle}>{weather.current.temperature}°</span>
                <p style={descStyle}>{weather.current.weatherDescription}</p>
              </div>

              <div style={statsGridStyle}>
                <div style={statBoxStyle}>
                  <small style={labelStyle}>VENTO</small>
                  <p style={valStyle}>{weather.current.windSpeed} <span style={{fontSize: '0.7rem'}}>km/h</span></p>
                </div>
                <div style={statBoxStyle}>
                  <small style={labelStyle}>ESTADO</small>
                  <p style={valStyle}>Otimizado</p> 
                </div>
              </div>

              <h4 style={{ textAlign: 'left', margin: '25px 0 15px', color: '#ef4444', letterSpacing: '1px' }}>
                PREVISÃO SEMANAL
              </h4>
              
              <div style={forecastGridStyle}>
                {weather.forecast.slice(1, 6).map((day, i) => (
                  <motion.div 
                    key={day.date}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={forecastCardStyle}
                  >
                    <small style={{ color: '#94a3b8' }}>
                      {new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </small>
                    <div style={{ fontSize: '1.2rem', margin: '8px 0' }}>{getWeatherIcon(day.weatherCode)}</div>
                    <strong style={{ color: '#ef4444' }}>{day.maxTemp}°</strong>
                    <span style={{ opacity: 0.5, fontSize: '0.8rem', marginLeft: '2px' }}>{day.minTemp}°</span>
                  </motion.div>
                ))}
              </div>
            </motion.main>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- ESTILOS MANTIDOS ---
const containerStyle: React.CSSProperties = { maxWidth: '500px', margin: '0 auto', padding: '60px 20px', textAlign: 'center', position: 'relative', zIndex: 1 };
const cardStyle: React.CSSProperties = { position: 'relative', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px', padding: '30px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden' };
const topRowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const iconBadgeStyle: React.CSSProperties = { fontSize: '2.5rem', background: 'linear-gradient(45deg, #7c3aed, #ef4444)', padding: '10px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(124, 58, 237, 0.3)' };
const mainTempStyle: React.CSSProperties = { margin: '40px 0' };
const tempNumberStyle: React.CSSProperties = { fontSize: '6rem', fontWeight: 800, background: 'linear-gradient(to bottom, #fff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block' };
const descStyle: React.CSSProperties = { fontSize: '1.1rem', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '-10px' };
const statsGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const statBoxStyle: React.CSSProperties = { background: 'rgba(239, 68, 68, 0.05)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.1)' };
const labelStyle: React.CSSProperties = { color: '#64748b', fontSize: '0.65rem', fontWeight: 'bold' };
const valStyle: React.CSSProperties = { margin: '5px 0 0', fontSize: '1.2rem', fontWeight: 'bold' };
const forecastGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' };
const forecastCardStyle: React.CSSProperties = { background: 'rgba(255, 255, 255, 0.02)', padding: '12px 5px', borderRadius: '12px', fontSize: '0.8rem', border: '1px solid rgba(255, 255, 255, 0.05)' };
const errorStyle: React.CSSProperties = { color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '15px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.9rem', lineHeight: '1.4' };
const loaderStyle: React.CSSProperties = { width: '40px', height: '40px', border: '4px solid rgba(124, 58, 237, 0.1)', borderTop: '4px solid #ef4444', borderRadius: '50%', margin: '20px auto' };

export default App;