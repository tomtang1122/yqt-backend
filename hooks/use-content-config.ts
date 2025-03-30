import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { updateClientConfigAction } from "@lib/action";
import { ClientConfig } from "@type/common";

export const useContentConfig = (
  filedName: keyof ClientConfig,
  configValue: string
) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      [filedName]: configValue || "",
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

  return { isPending, onSubmit, form };
};
