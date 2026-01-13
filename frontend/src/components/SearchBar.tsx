import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CitySuggestion {
  id: number;
  name: string;
  country: string;
  admin1?: string;
}

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, disabled }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showPopular, setShowPopular] = useState(false);

  // Reduzido para 4 lugares conforme solicitado
  const popularCities = ['Londres', 'Tóquio', 'Paris', 'São Paulo'];

  useEffect(() => {
    const fetchCities = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=pt`);
        setSuggestions(res.data.results || []);
      } catch {
        console.error("Erro ao buscar sugestões");
      }
    };

    const timer = setTimeout(fetchCities, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setSuggestions([]);
      setShowPopular(false);
    }
  };

  return (
    <div 
      style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto 20px' }}
      // Aciona ao passar o mouse por cima de toda a área da barra
      onMouseEnter={() => setShowPopular(true)}
      // Esconde ao tirar o mouse, a menos que o input esteja focado (opcional)
      onMouseLeave={() => {
        if (query.length === 0) setShowPopular(false);
      }}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          // Também exibe ao clicar (foco)
          onFocus={() => setShowPopular(true)}
          placeholder="Digite o nome da cidade..."
          disabled={disabled}
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={disabled}>Buscar</button>
      </form>

      {/* Sugestões da API (Sempre aparecem se houver texto) */}
      {suggestions.length > 0 && (
        <ul className="suggestion-list">
          {suggestions.map((city) => (
            <li key={city.id} onClick={() => {
              setQuery(`${city.name}, ${city.country}`);
              onSearch(city.name);
              setSuggestions([]);
              setShowPopular(false);
            }}>
              {city.name}, <small>{city.admin1 ? `${city.admin1} - ` : ''}{city.country}</small>
            </li>
          ))}
        </ul>
      )}

      {/* Cidades Populares (Aparece apenas se o mouse estiver em cima OU focado e query vazia) */}
      {showPopular && query.length === 0 && (
        <div className="popular-cities-dropdown">
          <small className="popular-label">DESTINOS POPULARES</small>
          <div className="popular-grid">
            {popularCities.map(city => (
              <span key={city} className="popular-tag" onClick={() => {
                setQuery(city);
                onSearch(city);
                setShowPopular(false);
              }}>
                {city}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};