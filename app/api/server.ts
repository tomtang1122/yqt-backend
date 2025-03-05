import { request, LOGIN_REQUEST_URL } from "./request";

export type LoginResponse = {
  adminAccount: string;
  adminToken: string;
  nickname: string;
  faceURL: string;
  level: number;
  adminUserID: string;
  imUserID: string;
  imToken: string;
};

export async function loginApi(params: {
  username: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}): Promise<LoginResponse | undefined> {
  try {
    const { data: { data } = {} } = await request.post<{ data: LoginResponse }>(
      LOGIN_REQUEST_URL,
      {
        account: params.username,
        password: params.password,
      }
    );

    return data;
  } catch {
    throw new Error("网络错误");
  }
}
