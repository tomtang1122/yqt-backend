import {
  request,
  GET_ENTERPRISE_REQUEST_URL,
  QUERY_ENTERPRISE_REQUEST_URL,
} from "./request";
import { Response, Enterprise } from "@type/common";

type EnterpriseResponse = {
  total?: number;
  enterprises?: Enterprise[];
};

export async function fetchEnterprise(): Promise<EnterpriseResponse> {
  try {
    const { data: { data } = {} } = await request.post<
      Response<EnterpriseResponse>
    >(QUERY_ENTERPRISE_REQUEST_URL, {
      pagination: { pageNumber: 1, showNumber: 100 },
    });
    return data || { total: 0, enterprises: [] };
  } catch (error) {
    throw error instanceof Error ? error : new Error("获取企业列表失败");
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
    throw error instanceof Error ? error : new Error("获取企业列表失败");
  }
}
