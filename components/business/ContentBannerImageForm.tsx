"use client";

import { Button } from "@components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@components/ui/form";
import { ImageUploader } from "@components/business/ImageUploader";
import { useTransition } from "react";
import { GlobalLoading } from "@components/business/globalLoading";
import Image from "next/image";
import { updateClientConfigAction } from "@lib/action";
import { ClientConfig } from "@type/common";
import { CLIENT_CONFIG_IMAGE_ALT } from "@constant/index";

export const ContentBannerImageForm = ({
  configValue,
  filedName,
}: {
  configValue?: string;
  filedName: keyof ClientConfig;
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      [filedName]: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        const result = await updateClientConfigAction(data, [filedName]);
        if (result?.error) {
          Object.entries(result.error).forEach(([key, value]) => {
            form.setError(key, {
              message: value[0],
            });
          });
        }
      } catch (e) {
        throw e;
      }
    });
  });

  return (
    <Form {...form}>
      {isPending && <GlobalLoading />}
      <form onSubmit={onSubmit} className="max-w-[840px]">
        <FormField
          control={form.control}
          name={filedName}
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormControl>
                <ImageUploader
                  defaultImageUrl={field.value}
                  onUploadSuccess={(url) => field.onChange(url)}
                />
              </FormControl>
              <FormMessage />
              <div className="flex items-center gap-2 border rounded-md p-2 justify-between">
                <span>当前图片：</span>
                {configValue ? (
                  <Image
                    src={configValue}
                    alt={
                      CLIENT_CONFIG_IMAGE_ALT[
                        filedName as keyof typeof CLIENT_CONFIG_IMAGE_ALT
                      ]
                    }
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
