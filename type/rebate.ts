// 贴息申请表单数据类型
export interface RebateQuery {
  procurementOrderID: string;
  contractNumber: string;
  invoiceAmount: number;
  invoiceDate: number;
  customerName: string;
  customerBankAccount: string;
  remark: string;
}

// API响应类型
export interface Rebate extends RebateQuery {
  orderID: string;
  status: number;
  readAt: number;
  processedAt: number;
  createTime: number;
}
