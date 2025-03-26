import {
  request,
  GET_ENTERPRISE_REQUEST_URL,
  QUERY_ENTERPRISE_REQUEST_URL,
  GET_CLIENT_CONFIG_URL,
} from "./request";
import { Response, Enterprise } from "@type/common";

type EnterpriseResponse = {
  total?: number;
  enterprises?: Enterprise[];
};

export const MAX_ENTERPRISE_PER_PAGE = 10;

export async function fetchEnterprise(
  pageNumber: number,
  query?: string
): Promise<EnterpriseResponse> {
  try {
    const { data: { data } = {} } = await request.post<
      Response<EnterpriseResponse>
    >(QUERY_ENTERPRISE_REQUEST_URL, {
      pagination: { pageNumber, showNumber: MAX_ENTERPRISE_PER_PAGE },
      nameKeyword: query,
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

type ClientConfigResponse = {
  [key: string]: string;
};

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
