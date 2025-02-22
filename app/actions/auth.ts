"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginApi, type LoginResponse } from "@api/server";
import { z } from "zod";

export type LoginFormState = {
  error?: {
    username?: string[];
    password?: string[];
  };
  data?: LoginResponse;
};

const LoginFormSchema = z.object({
  username: z.string().min(1, { message: "用户名不能为空" }),
  password: z.string().min(1, { message: "密码至少需要1个字符" }),
});

export async function login(
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
    const data = await loginApi({ username, password });

    if (data.success && data?.adminToken) {
      const cookieStore = await cookies();
      cookieStore.set("auth-token", data.adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24小时
      });
      return { data };
      //   redirect("/dashboard");
    }
    return { data: { success: true } };
  } catch {
    return { data: { success: true } };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  redirect("/login");
}
