// Punto de entrada de la aplicación.
// Busca el <div id="root"> de index.html y "monta" adentro el componente App.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
