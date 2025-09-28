"use client";

import { Button } from "@components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { GlobalLoading } from "@components/business/globalLoading";
import { ClientConfig } from "@type/index";
import { CLIENT_CONFIG_PLACEHOLDER } from "@constant/index";
import { useContentConfig } from "@hooks/use-content-config";

export const ContentTextForm = ({
  configValue,
  filedName,
}: {
  configValue?: string;
  filedName: keyof ClientConfig;
}) => {
  const { isPending, onSubmit, form } = useContentConfig(
    filedName,
    configValue || ""
  );

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
                <Input
                  placeholder={CLIENT_CONFIG_PLACEHOLDER[filedName]}
                  {...field}
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
