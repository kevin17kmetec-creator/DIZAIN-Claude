import React from 'react';
import ReactDOM from 'react-dom/client';
// Pisave gostimo sami (brez Google Fonts). Teme naložijo svoje pisave ob prvi uporabi.
import '@fontsource-variable/manrope';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
