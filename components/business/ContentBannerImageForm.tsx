"use client";

import { Button } from "@components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@components/ui/form";
import { AssetsUploader } from "@components/business/AssetsUploader";
import { GlobalLoading } from "@components/business/globalLoading";
import Image from "next/image";
import { ClientConfig } from "@type/index";
import { CLIENT_CONFIG_PLACEHOLDER } from "@constant/index";
import { useContentConfig } from "@hooks/use-content-config";

export const ContentBannerImageForm = ({
  configValue,
  filedName,
}: {
  configValue?: string;
  filedName: keyof ClientConfig;
}) => {
  const { isPending, onSubmit, form } = useContentConfig(filedName, "");

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
                <AssetsUploader
                  defaultAssetsUrl={field.value}
                  onUploadSuccess={(url) => field.onChange(url)}
                  acceptTypes="image/*"
                />
              </FormControl>
              <FormMessage />
              <div className="flex items-center gap-2 border rounded-md p-2 justify-between">
                <span>当前图片：</span>
                {configValue ? (
                  <Image
                    src={configValue}
                    alt={CLIENT_CONFIG_PLACEHOLDER[filedName]}
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
