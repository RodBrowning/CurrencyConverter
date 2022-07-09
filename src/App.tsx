import React, { useState, useEffect } from 'react';
import './App.scss';
import { BsCurrencyExchange } from 'react-icons/bs';
import CurrencyData from './Components/CurrencyData';
import Heading from './Components/Heading';
import { ISymbols } from './Types/Symbols';
import { ILatest } from './Types/Latest';

interface ICurrenciesInfo {
  symbols: ISymbols | {};
  latest: ILatest | {};
}

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currenciesInfo, setCurrenciesInfo] = useState<ICurrenciesInfo>({
    symbols: {},
    latest: {},
  });

  useEffect(() => {
    setLoading(true);
    const fetchCurrenciesSymbols = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3004/symbols');
        if (!response.ok) throw new Error("Can't connect to API");
        const data = await response.json();
        currenciesInfo.symbols = data;
        setCurrenciesInfo(currenciesInfo);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    const fetchCurrenciesLatest = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3004/latest');
        if (!response.ok) throw new Error("Can't connect to API");
        const data = await response.json();
        currenciesInfo.latest = data;
        setCurrenciesInfo(currenciesInfo);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrenciesSymbols();
    fetchCurrenciesLatest();
  }, []);

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
