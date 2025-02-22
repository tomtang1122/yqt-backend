import { request } from "./request";

export type LoginResponse = {
  success?: boolean;
  adminAccount?: string;
  adminToken?: string;
  nickname?: string;
  faceURL?: string;
  level?: number;
  adminUserID?: string;
  imUserID?: string;
  imToken?: string;
};

export async function loginApi(params: {
  username: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}): Promise<LoginResponse> {
  try {
    const { data } = await request.post<Omit<LoginResponse, "success">>(
      "/account/login",
      {
        account: params.username,
        password: params.password,
      }
    );

    return data;
  } catch {
    return {
      success: false,
    };
  }
}
