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
