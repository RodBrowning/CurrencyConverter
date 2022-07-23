import './style.scss';

import React, { useEffect, useRef, useState } from 'react';

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
  const [value, setValue] = useState<string>('0.00');
  const [displayValue, setDisplayValue] = useState<string>('');
  const [currencySymbol, setCurrencySymbol] = useState<string>('USD');
  const [currencyVal, setCurrencyVal] = useState<number>(1);
  const [symbolsAndTitles, setSymbolsAndTitles] = useState<[string, string][]>([]);

  const getSymbolsAndTitles = () => {
    const currenciesVal = currenciesInfo.symbols.symbols!;
    const symbolsAndTitles: [string, string][] = Object.entries(currenciesVal);
    setSymbolsAndTitles(symbolsAndTitles);
  };

  const userLocale = () => {
    return navigator && navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;
  };

  const currencyFormatter = Intl.NumberFormat(userLocale() || 'pt-BR', {
    style: 'currency',
    currency: currencySymbol,
    useGrouping: true,
  });

  const onSelectChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currencySymbol = e.target.value;
    const newValue = currenciesInfo.latest.rates![currencySymbol];
    setCurrencySymbol(currencySymbol);
    setCurrencyVal(newValue);
    setTitle(currenciesInfo.symbols.symbols![currencySymbol]);
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
    setDisplayValue(val);
    sendNewDolarAmountToParent(Number(val));
  };

  const convertDolarAmountToCurrency = (dolarAmount: DolarAmount, currencyVal: DolarValue): newValueAmount => {
    const currencyAmount = Number(dolarAmount) * currencyVal;
    return Number(currencyAmount.toString()).toFixed(2);
  };

  useEffect(() => {
    const inicialCurrencyVal = currenciesInfo.latest.rates![inicialCurrencySymbol];
    setCurrencySymbol(inicialCurrencySymbol);
    setCurrencyVal(inicialCurrencyVal);
    setCurrencySymbol(inicialCurrencySymbol);
    setBgCurrencyHandler(index, inicialCurrencySymbol);
    setTitle(currenciesInfo.symbols.symbols![inicialCurrencySymbol]);
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
    <div className="currency-panel">
      <select
        value={currencySymbol}
        onChange={(e) => {
          onSelectChangeHandler(e);
        }}
      >
        {symbolsAndTitles.map(([symbol, title]) => {
          return <option key={symbol} value={symbol}>{`${symbol} - ${title}`}</option>;
        })}
      </select>
      <input
        type="text"
        value={displayValue}
        ref={inputText}
        onChange={(e) => {
          onValueChangeHandler(e.target.value);
        }}
        onFocus={() => {
          setDisplayValue(value);
        }}
        onBlur={() => {
          setDisplayValue(currencyFormatter.format(Number(value)));
        }}
      />
    </div>
  );
};

export default CurrencyDisplay;
