/* eslint-disable react-hooks/purity */
import { useMemo } from 'react';
import './RainEffect.css';

export const RainEffect = () => {
  // 1. Geramos os valores aleatórios apenas uma vez usando useMemo
  const drops = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${1 + Math.random()}s` // Adicionei variação na velocidade também
    }));
  }, []); // Array de dependências vazio significa que só roda ao montar

  return (
    <div className="rain-container">
      {drops.map((drop) => (
        <div 
          key={drop.id} 
          className="drop" 
          style={{ 
            left: drop.left, 
            animationDelay: drop.delay,
            animationDuration: drop.duration
          }} 
        />
      ))}
    </div>
  );
};