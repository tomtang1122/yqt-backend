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
  tagsTypes?: number[];
  website?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  invoice?: string;
  remark?: string;
  isEligibleForCashback?: boolean;
  contacts?: string[];
}

export interface EnterpriseExtraRequestParams {
  clearContacts?: boolean;
  clearTags?: boolean;
}

export interface Enterprise extends EnterpriseParams {
  createTime?: number;
  enterpriseID?: string;
}

export interface ClientConfig {
  mobileBanner?: string;
  pcBanner?: string;
  appFile?: string;
  appVersion?: string;
  mobileBankQRCode?: string;
  pcBankQRCode?: string;
  // [key: string]: string | undefined;
}
