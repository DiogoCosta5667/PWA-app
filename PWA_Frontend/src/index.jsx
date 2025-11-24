import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import styles from './App.module.scss';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)