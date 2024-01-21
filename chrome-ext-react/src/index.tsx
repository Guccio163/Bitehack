import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// axios.defaults.baseURL = "http://127.0.0.1:8000/api";
// // tymczasowy, to jest token zalogowanego ziomka
// axios.defaults.headers.common[
//     "Authorization"
// ] = `Token e31909e316ed96c159b39668941662bdc9d31786`;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
