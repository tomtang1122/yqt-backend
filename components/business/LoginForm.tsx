"use client";

import { useTransition, useActionState } from "react";
import { loginAction } from "@lib/action";
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
import { GlobalLoading } from "@components/business/globalLoading";
import type { LoginFormParams } from "@type/common";

export const LoginForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
      {isPending && <GlobalLoading />}
      <div className="mb-6 text-center">
        <div className="font-semibold tracking-tight text-2xl mb-2">登录</div>
        <div className="text-sm text-muted-foreground">
          请输入您的用户名和密码登录到您的账户
        </div>
      </div>
      <Form {...form}>
        <form
          className="w-[320px] flex flex-col gap-6"
          onSubmit={form.handleSubmit((data) => {
            startTransition(async () => {
              try {
                const result = await loginAction(data);
                if (result?.error) {
                  Object.entries(result.error).forEach(([key, value]) => {
                    form.setError(key as keyof LoginFormParams, {
                      message: value[0],
                    });
                  });
                }
              } catch (e) {
                throw e;
              }
            });
          })}
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-inherit">用户名</FormLabel>
                <FormControl>
                  <Input placeholder="请输入用户名" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-inherit">密码</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="请输入密码" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" variant="default" disabled={isPending}>
            登录
          </Button>
        </form>
      </Form>
    </div>
  );
};
