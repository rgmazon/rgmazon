import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initGlassLight } from './lib/glassLight.js'
import { initRefraction } from './lib/refraction.js'

initGlassLight()
initRefraction()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
