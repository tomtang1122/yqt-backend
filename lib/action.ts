"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { request, LOGIN_REQUEST_URL } from "./request";
import { Response } from "@type/common";
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

    if (data?.adminToken && data?.imToken) {
      const cookieStore = await cookies();
      const defaultOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        maxAge: 60 * 60 * 24, // 24小时
      };
      cookieStore.set("admin-token", data.adminToken, defaultOptions);
      cookieStore.set("im-token", data.imToken, defaultOptions);
      redirect("/dashboard");
    }
    throw new Error("登录失败");
  } catch (error) {
    throw error instanceof Error ? error : new Error("登录失败");
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin-token");
  cookieStore.delete("im-token");
  redirect("/login");
}
