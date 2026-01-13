# 🌦️ MERRY**WEATHER**

> Aplicação moderna de previsão do tempo com foco em **UX**, **performance** e **design dinâmico**, utilizando geolocalização automática e dados climáticos em tempo real.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)

---

## 📌 Table of Contents

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tech Stack](#-tech-stack)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Performance e Cache](#-performance-e-cache)
- [Licença](#-licença)

---

## 📖 Sobre o Projeto

O **MerryWeather** é uma aplicação **fullstack** de previsão do tempo que oferece:

- Dados climáticos atualizados
- Interface responsiva e moderna
- Temas visuais que se adaptam às condições do clima
- Separação clara entre frontend e backend

O projeto foi pensado para demonstrar **boas práticas de arquitetura**, **uso de TypeScript**, **integração com APIs externas** e **experiência do usuário de alto nível**.

---

## ✨ Funcionalidades

- 📍 **Geolocalização automática via GPS**
- 🗺️ **Geocodificação reversa** (lat/lon → cidade real via Nominatim)
- 🔎 **Busca manual por cidade**
- 📆 **Previsão detalhada para os próximos 5 dias**
- 🎨 **Temas dinâmicos baseados no clima**
  - ☀️ Clear
  - ☁️ Cloudy
  - 🌧️ Rain
  - ⛈️ Storm
- ⚡ **Sistema de cache no backend para melhor performance**

---

## 🧰 Tech Stack

### Frontend
- React
- TypeScript
- Framer Motion
- Axios
- Lucide Icons

### Backend
- Node.js
- Express
- TypeScript
- Node-Cache

### APIs
- **Open-Meteo** — Dados climáticos
- **OpenStreetMap / Nominatim** — Geolocalização e geocodificação reversa

---

## 🧱 Arquitetura

```text
merryweather/
├── weather-app/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── utils/
│   │   │   └── server.ts
│   │   └── package.json
│   └── frontend/
│       ├── src/
│       ├── public/
│       └── package.json
└── README.md

```
---

## 🛠️ Instalação

### Pré-requisitos

- Node.js v18 ou superior

- npm ou yarn

```bash
cd weather-app/backend
npm install
npm run dev

 Backend

cd weather-app/backend
npm install
npm run dev

 Frontend

cd weather-app/frontend
npm install
npm run dev

```

## ▶️ Uso

 1. Ao acessar a aplicação, o navegador solicitará permissão de localização

 2. O clima local será exibido automaticamente

 3. Use o campo de busca para pesquisar outras cidades

 4. O tema visual muda conforme as condições climáticas

## ⚡ Performance e Cache

O backend utiliza Node-Cache para armazenar temporariamente as respostas das APIs externas.

### Benefícios:

- Menos requisições externas

- Respostas mais rápidas

## 📄 Licença

Este projeto está licenciado sob a MIT License.

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

Melhor estabilidade da aplicação
