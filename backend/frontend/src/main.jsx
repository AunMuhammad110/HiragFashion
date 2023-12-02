import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './components/App';
import ImageGallery from './components/BuyerSide.jsx/Card/Detailcard';
ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <App/>
    {/* <ImageGallery/> */}
  </BrowserRouter>,
)
