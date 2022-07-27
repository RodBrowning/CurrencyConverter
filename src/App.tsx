import './App.scss';
import './App-mobile.scss';

import React, { useEffect, useRef, useState } from 'react';

import CurrencyDisplay from './Components/CurrencyDisplay';
import Flag from './Components/Flags';
import { ILatest } from './Types/Latest';
import { ISymbols } from './Types/Symbols';
import fetchFrom from './Utils/fetch';
import getPageTitle from './Utils/pageTitles';

export interface ICurrenciesInfo {
  symbols: ISymbols;
  latest: ILatest;
}

const App: React.FC = () => {
  const firstRender = useRef<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [dolarAmount, setDolarAmount] = useState<string>('1.00');
  const [bgCurrency, setBgCurrency] = useState<string[]>(['USD', 'BRL']);
  const [currenciesInfo, setCurrenciesInfo] = useState<ICurrenciesInfo>({
    symbols: { success: false },
    latest: { success: false },
  });

  const bgCurrencyHandler = (index: number, currency: string): void => {
    bgCurrency[index] = currency;
    setBgCurrency({ ...bgCurrency });
  };

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = getPageTitle();
  }, []);

  useEffect(() => {
    if (!firstRender.current) return;
    fetchCurrenciesAPI();
    firstRender.current = false;
  }, []);

  return (
    <div className="App">
      <div className="main-container">
        {loading ? (
          <div className="loading">
            <h1>Loading...</h1>
          </div>
        ) : (
          ''
        )}
        {error ? (
          <div className="error">
            <h1>Some error ocurred.</h1>
            <h1>Open browser console for more details.</h1>
          </div>
        ) : (
          ''
        )}
        {currenciesInfo.symbols.success && currenciesInfo.latest.success ? (
          <>
            <div className="main-panel">
              <CurrencyDisplay
                dolarAmount={dolarAmount}
                setDolarAmountHandler={setDolarAmount}
                setBgCurrencyHandler={bgCurrencyHandler}
                index={0}
                currenciesInfo={currenciesInfo}
                inicialCurrencySymbol="USD"
              />
              <CurrencyDisplay
                dolarAmount={dolarAmount}
                setDolarAmountHandler={setDolarAmount}
                setBgCurrencyHandler={bgCurrencyHandler}
                index={1}
                currenciesInfo={currenciesInfo}
                inicialCurrencySymbol="BRL"
              />
            </div>
            <div className="bg-effect" />
            <div className="background-flags">
              <Flag currency={bgCurrency[0]} />
              <Flag currency={bgCurrency[1]} />
            </div>
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default App;
