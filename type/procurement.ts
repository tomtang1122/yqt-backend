export interface ProcurementQuery {
  vendor: string;
  integrator: string;
  endCustomer: string;
  purchaseAmount: number;
  paymentTermDays: number;
  originOrgName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  remark: string;
}

// API响应类型
export interface Procurement extends ProcurementQuery {
  orderID: string;
  status: number;
  readAt: number;
  processedAt: number;
  createTime: number;
}
