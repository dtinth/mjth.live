export interface BalanceTrackingYearlyData {
  year: number;
  in: Record<string, number>;
  out: Record<string, number>;
  totalIn: number;
  totalOut: number;
  startingBalance: number;
  endingBalance: number;
}

export interface BalanceTrackingData {
  byYear: {
    [year: `year${number}`]: BalanceTrackingYearlyData;
  };
}
