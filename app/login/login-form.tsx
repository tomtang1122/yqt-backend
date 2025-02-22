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

export default function LoginForm() {
  const [state, formAction] = useActionState(login, {
    data: { success: false },
  });
  console.log("~~~~~~~~~~~~~ state:", state);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form action={formAction} className="w-[320px] flex flex-col gap-6">
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
  );
}
