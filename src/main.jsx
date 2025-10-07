import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
  import { ToastContainer } from 'react-toastify';
// AIzaSyB4j7xPQvLaGQ39d81bs-I8s4ogHO01TJE
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer />
    
  </StrictMode>,
)
