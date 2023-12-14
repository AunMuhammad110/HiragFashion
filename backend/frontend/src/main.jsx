import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
      <App/>
    </Router>
)
