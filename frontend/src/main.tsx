import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8000/api'
// tymczasowy, to jest token zalogowanego ziomka
axios.defaults.headers.common['Authorization'] = `Token e31909e316ed96c159b39668941662bdc9d31786`


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
