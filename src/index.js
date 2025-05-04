import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReactGA from 'react-ga4';
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet"></link>

// Инициализация Google Analytics 4
ReactGA.initialize('G-XXXXXXXXXX'); // Замените на ваш Measurement ID

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Отправка данных производительности в аналитику
reportWebVitals((metric) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'web_vitals',
    name: metric.name,
    value: metric.value,
    id: metric.id,
  });
});