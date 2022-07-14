export interface ISymbols {
  success?: boolean | undefined;
  symbols?:
    | {
        [currencyAbbreviation: string]: string;
      }
    | undefined;
}
