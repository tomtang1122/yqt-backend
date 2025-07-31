"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  request,
  LOGIN_REQUEST_URL,
  ADD_ENTERPRISE_REQUEST_URL,
  DELETE_ENTERPRISE_REQUEST_URL,
  UPDATE_ENTERPRISE_REQUEST_URL,
  SET_CLIENT_CONFIG_URL,
} from "./request";
import { RECAPTCHA_ERROR } from "@constant/index";
import type {
  Response,
  EnterpriseParams,
  EnterpriseExtraRequestParams,
  ClientConfig,
  LoginFormParams,
} from "@type/common";

type LoginResponse = Response<{
  adminAccount?: string;
  adminToken?: string;
  nickname?: string;
  faceURL?: string;
  level?: number;
  adminUserID?: string;
  imUserID?: string;
  imToken?: string;
}>;

type LoginFormState = {
  error?: {
    [K in keyof LoginFormParams]?: string[];
  };
};

const LoginFormSchema = z.object({
  username: z.string().min(1, { message: "用户名不能为空" }),
  password: z.string().min(1, { message: "密码不能为空" }),
});

export async function loginAction(
  formData: LoginFormParams
): Promise<LoginFormState> {
  const validatedFields = LoginFormSchema.safeParse(formData);

  // validate error
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  // validate success
  const { username, password } = validatedFields.data;
  try {
    const { data: { data } = {} } = await request.post<LoginResponse>(
      LOGIN_REQUEST_URL,
      {
        account: username,
        password: password,
      }
    );

    if (!data?.adminToken || !data?.imToken) {
      return { error: { password: ["密码错误"] } };
    }
    const cookieStore = await cookies();
    const defaultOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 60 * 60 * 24, // 24小时
    };
    cookieStore.set("admin-token", data.adminToken, defaultOptions);
    cookieStore.set("im-token", data.imToken, defaultOptions);
    cookieStore.set("im-user-id", data.imUserID || "", defaultOptions);
  } catch (error) {
    if (error instanceof Error && error.message === RECAPTCHA_ERROR) {
      return { error: { password: ["密码错误"] } };
    } else {
      throw error;
    }
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin-token");
  cookieStore.delete("im-token");
  redirect("/login");
}

export type EnterpriseFormState = {
  error?: {
    [K in keyof EnterpriseParams]?: string[];
  };
};

const enterpriseFormSchema = z.object({
  logo: z.string().min(1, { message: "请上传企业logo" }),
  name: z.string().min(1, { message: "企业名称不能为空" }),
  website: z.string().url({ message: "请输入有效的网址" }),
  address: z.string().default("").optional(),
  phoneNumber: z.string().refine(
    (val) => {
      if (!val) return true;
      return /^((\+86)|(86))?(1[3-9]\d{9}|0\d{2,3}-?[1-9]\d{6,7})$/.test(val);
    },
    { message: "请输入有效的电话号码" }
  ),
  email: z.union([
    z.string().email({ message: "请输入有效的邮箱地址" }),
    z.string().length(0),
  ]),
  tags: z.array(z.string()).min(1, { message: "至少添加一个标签" }),
  tagsTypes: z.array(z.number()).nullish(),
  invoice: z.string().default("").optional(),
  remark: z.string().default("").optional(),
  contacts: z.array(z.string()).nullish(),
});

export async function createEnterpriseAction(
  formData: EnterpriseParams
): Promise<EnterpriseFormState | undefined> {
  const validatedFields = enterpriseFormSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const formDataToSend = validatedFields.data;
  try {
    await request.post<Response<EnterpriseParams>>(
      ADD_ENTERPRISE_REQUEST_URL,
      formDataToSend
    );
  } catch (error) {
    throw error;
  }

  revalidatePath("/dashboard/enterprise");
  redirect("/dashboard/enterprise");
}

export async function updateEnterpriseAction(
  enterpriseID: string,
  formData: EnterpriseParams & EnterpriseExtraRequestParams
): Promise<EnterpriseFormState | undefined> {
  const validatedFields = enterpriseFormSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const contactsLength = validatedFields.data?.contacts?.length ?? 0;
  const formDataToSend = validatedFields.data;
  try {
    await request.post<Response<EnterpriseParams>>(
      UPDATE_ENTERPRISE_REQUEST_URL,
      { enterpriseID, ...formDataToSend, clearContacts: contactsLength === 0 }
    );
  } catch (error) {
    throw error;
  }

  revalidatePath("/dashboard/enterprise");
  redirect("/dashboard/enterprise");
}

export async function deleteEnterpriseAction(enterpriseID?: string) {
  if (!enterpriseID) return;
  try {
    await request.post<Response<EnterpriseParams>>(
      DELETE_ENTERPRISE_REQUEST_URL,
      { enterpriseID }
    );
  } catch (error) {
    throw error;
  }

  revalidatePath("/dashboard/enterprise");
}

export type ClientConfigState = {
  error?: {
    [K in keyof ClientConfig]?: string[];
  };
};

const clientConfigSchema = z.object({
  mobileBanner: z.string().min(1, { message: "请上传移动端广告横幅" }),
  pcBanner: z.string().min(1, { message: "请上传PC端广告横幅" }),
  appFile: z.string().min(1, { message: "请上传APP文件" }),
  appVersion: z.string().min(1, { message: "APP版本号不能为空" }),
  mobileBankQRCode: z.string().optional(),
  pcBankQRCode: z.string().optional(),
});

export async function updateClientConfigAction(
  formData: ClientConfig,
  fieldsToValidate: (keyof ClientConfig)[]
): Promise<ClientConfigState | undefined> {
  const requiredFields = fieldsToValidate.reduce((acc, field) => {
    acc[field] = true;
    return acc;
  }, {} as Record<keyof ClientConfig, true>);
  const validatedFields = clientConfigSchema
    .pick(requiredFields)
    .safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await request.post<Response<EnterpriseParams>>(SET_CLIENT_CONFIG_URL, {
      config: formData,
    });
  } catch (error) {
    throw error;
  }

  revalidatePath("/dashboard/content-management");
}
