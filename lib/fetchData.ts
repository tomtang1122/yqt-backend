import { request, GET_ENTERPRISE_REQUEST_URL } from "./request";
import { Response, CreateEnterpriseParams } from "@type/common";

interface Enterprise extends CreateEnterpriseParams {
  createTime?: number;
  enterpriseID?: string;
}

type EnterpriseResponse = {
  total?: number;
  enterprises?: Enterprise[];
};

export async function fetchEnterprise(): Promise<EnterpriseResponse> {
  try {
    const { data: { data } = {} } = await request.post<
      Response<EnterpriseResponse>
    >(GET_ENTERPRISE_REQUEST_URL, {
      pagination: { pageNumber: 1, showNumber: 10 },
      nameKeyword: "1",
    });
    return data || { total: 0, enterprises: [] };
  } catch (error) {
    throw error instanceof Error ? error : new Error("获取企业列表失败");
  }
}
