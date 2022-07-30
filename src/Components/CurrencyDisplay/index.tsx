import './style.scss';
import './style-mobile.scss';

import React, { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line import/order
import { getTranslatedTitle, hasTranslation, userLocale } from './translatedCurrencies';

import { ICurrenciesInfo } from '../../App';

type DolarAmount = string;
type OriginAmount = number;
type DolarValue = number;
type newValueAmount = string;

interface Props {
  dolarAmount: string;
  setDolarAmountHandler: React.Dispatch<React.SetStateAction<string>>;
  setBgCurrencyHandler: Function;
  index: number;
  currenciesInfo: ICurrenciesInfo;
  inicialCurrencySymbol: string;
}

const CurrencyDisplay: React.FC<Props> = ({
  dolarAmount,
  setDolarAmountHandler,
  setBgCurrencyHandler,
  index,
  currenciesInfo,
  inicialCurrencySymbol,
}) => {
  const inputText = useRef<HTMLInputElement>(null);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [value, setValue] = useState<string>('0.00');
  const [displayValue, setDisplayValue] = useState<string>('');
  const [currencyTitle, setCurrencyTitle] = useState<string>();
  const [currencySymbol, setCurrencySymbol] = useState<string>('USD');
  const [currencyVal, setCurrencyVal] = useState<number>(1);
  const [symbolsAndTitles, setSymbolsAndTitles] = useState<[string, string][]>([]);

  const getSymbolsAndTitles = () => {
    const currenciesVal = currenciesInfo.symbols.symbols!;
    const symbolsAndTitles: [string, string][] = Object.entries(currenciesVal);
    setSymbolsAndTitles(symbolsAndTitles);
  };

  const currencyFormatter = Intl.NumberFormat(userLocale() || 'en-US', {
    style: 'currency',
    currency: currencySymbol,
    useGrouping: true,
  });

  const setTitle = (currencySymbol: string) => {
    if (hasTranslation()) {
      const pTitle = getTranslatedTitle(currencySymbol);
      setCurrencyTitle(pTitle);
    } else {
      setCurrencyTitle(currenciesInfo.symbols.symbols![currencySymbol]);
    }
  };

  const onSelectChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currencySymbol = e.target.value;
    const newValue = currenciesInfo.latest.rates![currencySymbol];
    setCurrencySymbol(currencySymbol);
    setCurrencyVal(newValue);
    setTitle(currencySymbol);
    setBgCurrencyHandler(index, currencySymbol);
  };

  const convertAmountToDolar = (amount: OriginAmount, currencyVal: DolarValue): DolarAmount => {
    const dolarAmount = amount / currencyVal;
    return Number(dolarAmount.toString()).toFixed(2);
  };

  const sendNewDolarAmountToParent = (inputValue: number) => {
    const newDolarVal = convertAmountToDolar(inputValue, currencyVal);
    setDolarAmountHandler(newDolarVal);
  };

  const onValueChangeHandler = (inputValue: string) => {
    const val = inputValue;
    const regEx = /^((0|[1-9]\d*)(\.(\d+)?)?)?$/;
    const valid = regEx.test(val);
    if (!valid) return;

    setValue(val);
    setDisplayValue(currencyFormatter.format(Number(val)));
    sendNewDolarAmountToParent(Number(val));
  };

  const convertDolarAmountToCurrency = (dolarAmount: DolarAmount, currencyVal: DolarValue): newValueAmount => {
    const currencyAmount = Number(dolarAmount) * currencyVal;
    return Number(currencyAmount.toString()).toFixed(2);
  };

  useEffect(() => {
    const inicialCurrencyVal = currenciesInfo.latest.rates![inicialCurrencySymbol];
    setCurrencyVal(inicialCurrencyVal);
    setCurrencySymbol(inicialCurrencySymbol);
    setBgCurrencyHandler(index, inicialCurrencySymbol);
    setTitle(inicialCurrencySymbol);
    getSymbolsAndTitles();
  }, []);

  useEffect(() => {
    const currencyAmount = convertDolarAmountToCurrency(dolarAmount, currencyVal);
    if (document.activeElement !== inputText.current) {
      setValue(currencyAmount);
      setDisplayValue(currencyFormatter.format(Number(currencyAmount)));
    }
  }, [dolarAmount, currencyVal]);

  return (
    <div className="currency-display">
      <div className="selected-currency">
        <h2>{currencyTitle}</h2>
      </div>
      <div className="select-wrapper">
        <select
          value={currencySymbol}
          onChange={(e) => {
            onSelectChangeHandler(e);
          }}
        >
          {symbolsAndTitles.map(([symbol]) => {
            return <option key={symbol} value={symbol}>{`${symbol}`}</option>;
          })}
        </select>
        <svg width="15" height="9" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0.548209 0.944665C1.18041 0.297965 2.06056 0.247215 2.83341 0.944665L8.50001 6.37782L14.1666 0.944665C14.9395 0.247215 15.8211 0.297965 16.4489 0.944665C17.0811 1.58992 17.0405 2.68032 16.4489 3.28642C15.8602 3.89252 9.64116 9.81431 9.64116 9.81431C9.49306 9.9678 9.31557 10.0899 9.11925 10.1733C8.92294 10.2566 8.71184 10.2996 8.49856 10.2996C8.28527 10.2996 8.07418 10.2566 7.87787 10.1733C7.68155 10.0899 7.50405 9.9678 7.35596 9.81431C7.35596 9.81431 1.13981 3.89252 0.548209 3.28642C-0.044841 2.68032 -0.083991 1.58992 0.548209 0.944665Z"
            fill="black"
            fillOpacity="0.9"
          />
        </svg>
      </div>
      <div className="input-wrapper">
        {showInput ? (
          <input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            type="text"
            value={value}
            ref={inputText}
            onChange={(e) => {
              onValueChangeHandler(e.target.value);
            }}
            onBlur={() => {
              setShowInput(false);
            }}
            // eslint-disable-next-line consistent-return
            onKeyDown={(e) => {
              if (e.code === 'Enter' || e.code === 'NumpadEnter') return e.target.blur();
            }}
          />
        ) : (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div
            className="display-value"
            onClick={() => {
              setShowInput(true);
            }}
          >
            <p>{displayValue}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyDisplay;
