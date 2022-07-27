const pageTitles: { [language: string]: string } = {
  pt: 'Conversor de moedas',
  es: 'Convertidor de moneda',
  en: 'Currency converter',
};

const userLocale = () => {
  const lang =
    navigator && navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;
  return lang.split('-')[0];
};

const hasTranslation = () => {
  return pageTitles[userLocale()] !== undefined;
};

const getPageTitle = () => {
  if (!hasTranslation()) return pageTitles.en;
  return pageTitles[userLocale()];
};

export default getPageTitle;
