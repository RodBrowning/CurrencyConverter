const TranslatedTitles: { [language: string]: string } = {
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
  return TranslatedTitles[userLocale()] !== undefined;
};

const getTranslatedTitle = () => {
  if (!hasTranslation()) return TranslatedTitles.en;
  return TranslatedTitles[userLocale()];
};

export default getTranslatedTitle;
