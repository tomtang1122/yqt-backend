"use client";

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
import { ImageUploader } from "@components/business/ImageUploader";
import { useTransition } from "react";
import { GlobalLoading } from "@components/business/globalLoading";

export const ContentManageForm = () => {
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
        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.log("~~~~~~~~~~~~~ data:", data);
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
            <FormItem className="mb-3">
              <FormLabel className="!text-inherit">移动端广告横幅：</FormLabel>
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
          name="pcBanner"
          render={({ field }) => (
            <FormItem className="mb-8">
              <FormLabel className="!text-inherit">桌面端广告横幅：</FormLabel>
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
        <div className="flex justify-end gap-4">
          <Button type="submit" variant="default" disabled={isPending}>
            提交
          </Button>
        </div>
      </form>
    </Form>
  );
};
