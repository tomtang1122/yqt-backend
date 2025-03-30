export interface Response<T> {
  errCode?: number;
  errDlt?: string;
  errMsg?: string;
  data?: T;
}

export interface LoginFormParams {
  username?: string;
  password?: string;
}

export interface EnterpriseParams {
  logo?: string;
  name?: string;
  tags?: string[];
  website?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  isEligibleForCashback?: boolean;
}

export interface Enterprise extends EnterpriseParams {
  createTime?: number;
  enterpriseID?: string;
}

export interface ClientConfig {
  mobileBanner?: string;
  pcBanner?: string;
  // [key: string]: string | undefined;
}
