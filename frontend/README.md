🌦️ MerryWeather
O MerryWeather é uma aplicação de previsão do tempo moderna e responsiva que oferece dados climáticos em tempo real com uma interface elegante e dinâmica. O sistema utiliza inteligência de localização para fornecer informações precisas sem que o usuário precise digitar uma única tecla.

✨ Funcionalidades
📍 Geolocalização Automática: Identifica a posição do usuário via GPS ao abrir o app e carrega o clima local instantaneamente.

🗺️ Geocodificação Reversa: Converte coordenadas de latitude e longitude em nomes reais de cidades e países (Ex: transforma -30.01, -51.22 em Porto Alegre, Brasil).

🔍 Busca Inteligente: Barra de pesquisa para consultar o clima de qualquer cidade do mundo pelo nome.

📅 Previsão de 7 Dias: Exibição detalhada da semana, com temperaturas máximas, mínimas e probabilidade de precipitação.

🎨 Temas Dinâmicos: A interface reage ao tempo! O fundo e as cores mudam conforme o clima (Céu Limpo, Nublado, Chuva ou Tempestade).

🌧️ Efeitos Visuais: Componente de animação de chuva (RainEffect) que é ativado automaticamente em dias chuvosos.

⚡ Sistema de Cache: Backend otimizado com cache em memória para reduzir latência e evitar limites de requisição nas APIs.

🚀 Tecnologias
Frontend
React com TypeScript

Framer Motion (Animações de entrada e transições de estado)

Axios (Comunicação com o backend)

Lucide React (Ícones meteorológicos)

Backend
Node.js com Express

TypeScript

Node-Cache (Cache de geolocalização e clima)

Integrações:

Open-Meteo: Dados meteorológicos e busca por nome.

Nominatim (OpenStreetMap): Geocodificação reversa de coordenadas.

🛠️ Instalação
1. Backend
Bash

cd backend
npm install
npm run dev
2. Frontend
Bash

cd frontend
npm install
npm run dev