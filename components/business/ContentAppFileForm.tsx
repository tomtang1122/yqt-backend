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
import { ClientConfig } from "@type/common";
import { useContentConfig } from "@hooks/use-content-config";

export const ContentAppFileForm = ({
  filedName,
}: {
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
                  acceptTypes=".apk"
                />
              </FormControl>
              <FormMessage />
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
