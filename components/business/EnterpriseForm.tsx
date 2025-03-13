"use client";

import { type EnterpriseFormState } from "@lib/action";
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
import { Switch } from "@components/ui/switch";
import { EnterpriseParams } from "@type/common";
import Link from "next/link";
import { ImageUploader } from "@components/business/ImageUploader";

type FormData = Omit<EnterpriseParams, "tags">;

export const EnterpriseForm = (props: {
  action: (formData: FormData) => Promise<EnterpriseFormState | undefined>;
  defaultValues?: FormData;
  isEdit?: boolean;
}) => {
  const { action, defaultValues, isEdit } = props;

  const form = useForm({
    defaultValues: defaultValues || {
      name: "",
      logo: "",
      website: "",
      address: "",
      phoneNumber: "",
      email: "",
      isEligibleForCashback: false,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const result = await action(data);
      if (result?.error) {
        Object.entries(result.error).forEach(([key, value]) => {
          form.setError(key as unknown as keyof typeof data, {
            message: value[0],
          });
        });
      }
    } catch (e) {
      console.error(e);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="max-w-[840px] mt-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel className="!text-inherit">企业名称：</FormLabel>
              <FormControl>
                <Input placeholder="请输入企业名称" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel className="!text-inherit">企业网址：</FormLabel>
              <FormControl>
                <Input placeholder="请输入企业网址" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel className="!text-inherit">企业地址：</FormLabel>
              <FormControl>
                <Input placeholder="请输入企业地址" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel className="!text-inherit">企业邮箱：</FormLabel>
              <FormControl>
                <Input placeholder="请输入企业邮箱" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel className="!text-inherit">企业电话：</FormLabel>
              <FormControl>
                <Input placeholder="请输入企业电话" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel className="!text-inherit">企业logo：</FormLabel>
              <FormControl>
                <ImageUploader
                  defaultImageUrl={field.value}
                  onUploadSuccess={(url) => field.onChange(url)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isEligibleForCashback"
          render={({ field }) => (
            <FormItem className="mb-8">
              <FormLabel className="!text-inherit">是否支持返现：</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button asChild type="button" variant="outline">
            <Link href="/dashboard/enterprise">返回</Link>
          </Button>
          <Button type="submit" variant="default">
            {isEdit ? "更新" : "创建"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
