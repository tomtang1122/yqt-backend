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
} from "./request";
import { Response, EnterpriseParams } from "@type/common";
import { md5 } from "js-md5";

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
    username?: string[];
    password?: string[];
  };
};

const LoginFormSchema = z.object({
  username: z.string().min(1, { message: "用户名不能为空" }),
  password: z.string().min(1, { message: "密码至少需要1个字符" }),
});

export async function loginAction(
  _: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const validatedFields = LoginFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

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
        password: md5(password),
      }
    );

    if (!data?.adminToken || !data?.imToken) {
      throw new Error("登录失败");
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
    throw error;
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
  address: z.string().min(1, { message: "企业地址不能为空" }),
  phoneNumber: z
    .string()
    .regex(
      /^((\+86)|(86))?(1[3-9]\d{9}|0\d{2,3}-?[1-9]\d{6,7})$/,
      "请输入有效的电话号码"
    ),
  email: z.string().email({ message: "请输入有效的邮箱地址" }),
  tags: z.array(z.string()).min(1, { message: "至少添加一个标签" }),
  isEligibleForCashback: z.boolean().default(false).optional(),
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
      UPDATE_ENTERPRISE_REQUEST_URL,
      { enterpriseID, ...formDataToSend }
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
