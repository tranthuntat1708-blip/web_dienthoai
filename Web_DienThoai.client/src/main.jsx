import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

document.title = 'TechStore - Mua Sắm Công Nghệ Chính Hãng'
const loadingEl = document.getElementById('loading')
if (loadingEl) loadingEl.textContent = 'Đang tải TechStore...'

document.title = "TechStore - Mua Sắm Công Nghệ Chính Hãng";
if (loadingEl) loadingEl.textContent = "Đang tải TechStore...";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
