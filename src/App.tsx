import './App.scss';

import React, { useEffect, useRef, useState } from 'react';

import { BsCurrencyExchange } from 'react-icons/bs';
import CurrencyDisplay from './Components/CurrencyDisplay';
import Heading from './Components/Heading';
import { ILatest } from './Types/Latest';
import { ISymbols } from './Types/Symbols';
import fetchFrom from './Utils/fetch';

export interface ICurrenciesInfo {
  symbols: ISymbols;
  latest: ILatest;
}

const App: React.FC = () => {
  const firstRender = useRef<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [dolarAmount, setDolarAmount] = useState<string>('1.00');
  const [currenciesInfo, setCurrenciesInfo] = useState<ICurrenciesInfo>({
    symbols: { success: false },
    latest: { success: false },
  });

  const fetchCurrenciesAPI = async () => {
    setLoading(true);
    try {
      currenciesInfo.symbols = await fetchFrom('symbols');
      currenciesInfo.latest = await fetchFrom('latest');
      setCurrenciesInfo((oldCurrenciesInfoState) => {
        return { ...oldCurrenciesInfoState, ...currenciesInfo };
      });
    } catch (e) {
      setError(true);
      // eslint-disable-next-line no-console
      console.error(e);
      // eslint-disable-next-line no-console
      console.error("Can't connect to API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!firstRender.current) return;
    fetchCurrenciesAPI();
    firstRender.current = false;
  }, []);

  return (
    <div className="App">
      <div className="main-container">
        <Heading />
        <div className="main-panel">
          {loading ? 'Loading...' : ''}
          {error ? 'Some error ocurred. Open browser console for more details.' : ''}
          {currenciesInfo.symbols.success && currenciesInfo.latest.success ? (
            <>
              <CurrencyDisplay
                dolarAmount={dolarAmount}
                setDolarAmountHandler={setDolarAmount}
                currenciesInfo={currenciesInfo}
                inicialCurrencySymbol="USD"
              />
              <BsCurrencyExchange className="exchange-icon" />
              <CurrencyDisplay
                dolarAmount={dolarAmount}
                setDolarAmountHandler={setDolarAmount}
                currenciesInfo={currenciesInfo}
                inicialCurrencySymbol="EUR"
              />
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
