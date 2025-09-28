export interface Response<T> {
  errCode?: number;
  errDlt?: string;
  errMsg?: string;
  data?: T;
}
