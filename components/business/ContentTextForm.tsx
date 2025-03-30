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
import { Input } from "@components/ui/input";
import { useTransition } from "react";
import { GlobalLoading } from "@components/business/globalLoading";
import { updateClientConfigAction } from "@lib/action";
import { ClientConfig } from "@type/common";
import { CLIENT_CONFIG_PLACEHOLDER } from "@constant/index";

export const ContentTextForm = ({
  configValue,
  filedName,
}: {
  configValue?: string;
  filedName: keyof ClientConfig;
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      [filedName]: configValue,
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
