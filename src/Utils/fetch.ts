import { checkCookie, setCookie } from './cookies';

import { ILatest } from '../Types/Latest';
import { ISymbols } from '../Types/Symbols';

const fetchCurrencies = async (path: 'symbols' | 'latest'): Promise<ISymbols | ILatest> => {
  const response = await fetch(`http://localhost:3004/${path}`);
  const data: ISymbols | ILatest = await response.json();
  return data;
};

export default async (path: 'symbols' | 'latest') => {
  const hasCookieFromPath = checkCookie(path);
  const hasLocalStorageFromPath = localStorage.getItem(path);
  let currencyData = {};

  if (hasCookieFromPath && hasLocalStorageFromPath) {
    const localStorageDataString = localStorage.getItem(path);
    const localStorageData: ISymbols | ILatest = JSON.parse(localStorageDataString!);
    currencyData = localStorageData;
  } else {
    currencyData = await fetchCurrencies(path);
    const dataStringForLocalStorage = JSON.stringify(currencyData);
    localStorage.setItem(path, dataStringForLocalStorage);
    const expire = path === 'symbols' ? 720 : 12;
    setCookie(path, 'updated', expire);
  }
  return currencyData;
};
