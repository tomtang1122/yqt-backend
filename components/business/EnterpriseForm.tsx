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
import { useTransition, useState } from "react";
import { GlobalLoading } from "@components/business/globalLoading";
import { Icons } from "@components/ui/icon";

export const EnterpriseForm = (props: {
  action: (
    formData: EnterpriseParams
  ) => Promise<EnterpriseFormState | undefined>;
  defaultValues?: EnterpriseParams;
  isEdit?: boolean;
}) => {
  const { action, defaultValues, isEdit } = props;

  const [isPending, startTransition] = useTransition();
  const [tagInput, setTagInput] = useState("");
  const [isAddTag, setIsAddTag] = useState<boolean>(false);

  const form = useForm({
    defaultValues: defaultValues || {
      name: "",
      logo: "",
      website: "",
      address: "",
      phoneNumber: "",
      email: "",
      tags: [],
      isEligibleForCashback: false,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        const result = await action(data);
        if (result?.error) {
          Object.entries(result.error).forEach(([key, value]) => {
            form.setError(key as keyof EnterpriseParams, {
              message: value[0],
            });
          });
        }
      } catch (e) {
        console.error(e);
      }
    });
  });

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (tagInput.trim() !== "") {
        const currentTags = form.getValues("tags") || [];
        if (!currentTags.includes(tagInput.trim())) {
          form.setValue("tags", [...currentTags, tagInput.trim()]);
        }
        setTagInput("");
        setIsAddTag(false);
      }
    }
  };

  return (
    <Form {...form}>
      {isPending && <GlobalLoading />}
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
          name="tags"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel className="!text-inherit">企业标签：</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2 items-center">
                {isAddTag ? (
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="输入企业标签, 按回车添加"
                    className="w-[200px]"
                  />
                ) : (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsAddTag(true)}
                  >
                    <Icons.Plus className="w-4 h-4" />
                  </Button>
                )}
                {field.value?.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md"
                  >
                    <span>{tag}</span>
                    <Button
                      className="hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                      variant="ghost"
                      size="icon"
                      type="button"
                    >
                      <Icons.Trash className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
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
          <Button type="submit" variant="default" disabled={isPending}>
            {isEdit ? "更新" : "创建"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
