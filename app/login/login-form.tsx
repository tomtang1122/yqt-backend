"use client";

import { useActionState } from "react";
import { login } from "@actions/auth";
import { Button } from "@components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { md5 } from "js-md5";

export default function LoginForm() {
  const [state, formAction] = useActionState(login, {});

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = (formData: FormData) => {
    const rawPassword = formData.get("password");
    if (rawPassword) {
      formData.set("password", md5(rawPassword as string));
    }
    formAction(formData);
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
      <div className="mb-6 text-center">
        <div className="font-semibold tracking-tight text-2xl mb-2">登录</div>
        <div className="text-sm text-muted-foreground">
          请输入您的用户名和密码登录到您的账户
        </div>
      </div>
      <Form {...form}>
        <form action={handleSubmit} className="w-[320px] flex flex-col gap-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>用户名</FormLabel>
                <FormControl>
                  <Input placeholder="请输入用户名" {...field} />
                </FormControl>
                {state?.error?.username && (
                  <FormMessage>{state.error.username[0]}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="请输入密码" {...field} />
                </FormControl>
                {state?.error?.password && (
                  <FormMessage>{state.error.password[0]}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <Button type="submit" variant="default">
            登录
          </Button>
        </form>
      </Form>
    </div>
  );
}
