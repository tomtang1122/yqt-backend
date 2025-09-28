import {
  request,
  GET_ENTERPRISE_REQUEST_URL,
  QUERY_ENTERPRISE_REQUEST_URL,
  GET_CLIENT_CONFIG_URL,
  QUERY_PROCUREMENT_REQUEST_URL,
  QUERY_REBATE_REQUEST_URL,
} from "./request";
import { Response, Enterprise, ClientConfig, Procurement, Rebate } from "@type/index";

type EnterpriseResponse = {
  total?: number;
  enterprises?: Enterprise[];
};

export const MAX_ITEMS_PER_PAGE = 10;

export async function fetchEnterprise(
  pageNumber: number,
  query?: string
): Promise<EnterpriseResponse> {
  try {
    const { data: { data } = {} } = await request.post<
      Response<EnterpriseResponse>
    >(QUERY_ENTERPRISE_REQUEST_URL, {
      pagination: { pageNumber, showNumber: MAX_ITEMS_PER_PAGE },
      nameKeyword: query,
    });
    return data || { total: 0, enterprises: [] };
  } catch (error) {
    throw error;
  }
}

export async function fetchAllEnterprise(): Promise<EnterpriseResponse> {
  try {
    const { data: { data } = {} } = await request.post<
      Response<EnterpriseResponse>
    >(QUERY_ENTERPRISE_REQUEST_URL, {
      pagination: { pageNumber: 1, showNumber: 100000 },
    });
    return data || { total: 0, enterprises: [] };
  } catch (error) {
    throw error;
  }
}

export async function fetchEnterpriseById(
  id: string
): Promise<Enterprise | undefined> {
  try {
    const { data: { data } = {} } = await request.post<
      Response<{ enterprise?: Enterprise }>
    >(GET_ENTERPRISE_REQUEST_URL, {
      enterpriseID: id,
    });
    return data?.enterprise;
  } catch (error) {
    throw error;
  }
}

interface ClientConfigResponse {
  config: ClientConfig;
}

export async function fetchClientConfig(): Promise<
  ClientConfigResponse | undefined
> {
  try {
    const { data: { data } = {} } = await request.post<
      Response<ClientConfigResponse>
    >(GET_CLIENT_CONFIG_URL, {});
    return data;
  } catch (error) {
    throw error;
  }
}

type ProcurementResponse = {
  total?: number;
  procurementOrders?: Procurement[];
};

interface FetchProcurementParams {
  pageNumber: number;
  keyword?: string;
  status?: number;
  startCreateTime?: number;
  endCreateTime?: number;
}

export async function fetchProcurement(
  params: FetchProcurementParams
): Promise<ProcurementResponse> {
  try {
    const { data: { data } = {} } = await request.post<
      Response<ProcurementResponse>
    >(QUERY_PROCUREMENT_REQUEST_URL, {
      pagination: { pageNumber: params.pageNumber, showNumber: MAX_ITEMS_PER_PAGE },
      keyword: params.keyword,
      status: params.status,
      startCreateTime: params.startCreateTime,
      endCreateTime: params.endCreateTime,
    });
    return data || { total: 0, procurementOrders: [] };
  } catch (error) {
    throw error;
  }
}

type RebateResponse = {
  total?: number;
  rebateOrders?: Rebate[];
};

interface FetchRebateParams {
  pageNumber: number;
  keyword?: string;
  status?: number;
  startCreateTime?: number;
  endCreateTime?: number;
}

export async function fetchRebate(
  params: FetchRebateParams
): Promise<RebateResponse> {
  try {
    const { data: { data } = {} } = await request.post<
      Response<RebateResponse>
    >(QUERY_REBATE_REQUEST_URL, {
      pagination: { pageNumber: params.pageNumber, showNumber: MAX_ITEMS_PER_PAGE },
      keyword: params.keyword,
      status: params.status,
      startCreateTime: params.startCreateTime,
      endCreateTime: params.endCreateTime,
    });
    return data || { total: 0, rebateOrders: [] };
  } catch (error) {
    throw error;
  }
}
