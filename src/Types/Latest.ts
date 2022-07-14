export interface ILatest {
  success?: boolean | undefined;
  timestamp?: number | undefined;
  base?: string | undefined;
  date?: string | undefined;
  rates?:
    | {
        [currencySymbol: string]: number;
      }
    | undefined;
}
