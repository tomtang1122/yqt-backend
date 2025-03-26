"use client";

import { Button } from "@components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@components/ui/form";
import { ImageUploader } from "@components/business/ImageUploader";
import { useTransition } from "react";
import { GlobalLoading } from "@components/business/globalLoading";
import Image from "next/image";
import { getProxyImageUrl } from "@lib/utils";
import { updateClientConfigAction } from "@lib/action";
import { ClientConfig } from "@type/common";

export const ContentManageForm = ({
  clientConfig,
}: {
  clientConfig: ClientConfig;
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      mobileBanner: "",
      pcBanner: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        await updateClientConfigAction(data);
      } catch (e) {
        console.error(e);
      }
    });
  });

  return (
    <Form {...form}>
      {isPending && <GlobalLoading />}
      <form onSubmit={onSubmit} className="max-w-[840px] mt-6">
        <FormField
          control={form.control}
          name="mobileBanner"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel className="!text-inherit">
                1. 移动端广告横幅：
              </FormLabel>
              <FormControl>
                <ImageUploader
                  defaultImageUrl={field.value}
                  onUploadSuccess={(url) => field.onChange(url)}
                />
              </FormControl>
              <div className="flex items-center gap-2 border rounded-md p-2 justify-between">
                <span>当前图片：</span>
                {clientConfig.mobileBanner ? (
                  <Image
                    src={getProxyImageUrl(clientConfig.mobileBanner)}
                    alt="移动端广告横幅"
                    width={120}
                    height={120}
                  />
                ) : (
                  <span>无</span>
                )}
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pcBanner"
          render={({ field }) => (
            <FormItem className="mb-8">
              <FormLabel className="!text-inherit">
                2. 桌面端广告横幅：
              </FormLabel>
              <FormControl>
                <ImageUploader
                  defaultImageUrl={field.value}
                  onUploadSuccess={(url) => field.onChange(url)}
                />
              </FormControl>
              <div className="flex items-center gap-2 border rounded-md p-2 justify-between">
                <span>当前图片：</span>
                {clientConfig.pcBanner ? (
                  <Image
                    src={getProxyImageUrl(clientConfig.pcBanner)}
                    alt="桌面端广告横幅"
                    width={120}
                    height={120}
                  />
                ) : (
                  <span>无</span>
                )}
              </div>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button type="submit" variant="default" disabled={isPending}>
            提交
          </Button>
        </div>
      </form>
    </Form>
  );
};
