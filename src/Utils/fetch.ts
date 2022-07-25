import { checkCookie, setCookie } from './cookies';

import { ILatest } from '../Types/Latest';
import { ISymbols } from '../Types/Symbols';

const fetchCurrencies = async (pPath: 'symbols' | 'latest'): Promise<ISymbols | ILatest> => {
  let URL = 'http://localhost:3004/';
  let path = `${pPath}`;
  const headers = new Headers();
  if (import.meta.env.PROD) {
    URL = import.meta.env.VITE_BASE_API_URL;
    path = pPath === 'latest' ? `${pPath}?base=USD` : pPath;
    headers.append('apikey', import.meta.env.VITE_API_KEY);
  }
  const response = await fetch(`${URL}${path}`, { headers });
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
