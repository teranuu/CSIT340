import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import './styles/base.css';
import ReactDOM from 'react-dom/client';
import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import CartProvider from './context/CartContext';
import FilterProvider from './context/FilterContext';
library.add(fas, far, fab);

createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <CartProvider>
      <FilterProvider>
        <App />
      </FilterProvider>
    </CartProvider>
  </React.StrictMode>,
)
