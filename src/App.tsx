import React, { useState, useEffect, useRef } from 'react';
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
  const firstRender = useRef<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [currenciesInfo, setCurrenciesInfo] = useState<ICurrenciesInfo>({
    symbols: {},
    latest: {},
  });

  useEffect(() => {
    if (!firstRender.current) return;
    setLoading(true);

    const fetchCurrenciesSymbols = async () => {
      try {
        const response = await fetch('http://localhost:3004/symbols');
        if (!response.ok) throw new Error("Can't connect to API");
        const data = await response.json();
        currenciesInfo.symbols = data;
        setCurrenciesInfo(currenciesInfo);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('error: ', e);
      }
    };
    const fetchCurrenciesLatest = async () => {
      try {
        const response = await fetch('http://localhost:3004/latest');
        if (!response.ok) throw new Error("Can't connect to API");
        const data = await response.json();
        currenciesInfo.latest = data;
        setCurrenciesInfo(currenciesInfo);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('error: ', e);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrenciesSymbols();
    fetchCurrenciesLatest();

    console.log(currenciesInfo);
    firstRender.current = false;
  }, []);

  return (
    <div className="App">
      <div className="main-container">
        <Heading />
        <div className="main-panel">
          {loading ? 'loading' : ''}
          <CurrencyData />
          <BsCurrencyExchange className="exchange-icon" />
          <CurrencyData />
        </div>
      </div>
    </div>
  );
};

export default App;
