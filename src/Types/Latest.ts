export interface ILatest {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: {
    [currencyValue: string]: number;
  };
}
