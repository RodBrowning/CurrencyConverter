import React from 'react';
import './App.scss';
import { BsCurrencyExchange } from 'react-icons/bs';
import CurrencyData from './Components/CurrencyData';
import Heading from './Components/Heading';

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="main-container">
        <Heading />
        <div className="main-panel">
          <CurrencyData />
          <BsCurrencyExchange className="exchange-icon" />
          <CurrencyData />
        </div>
      </div>
    </div>
  );
};

export default App;
