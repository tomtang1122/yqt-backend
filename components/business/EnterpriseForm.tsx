"use client";

import clsx from "clsx";
import { type EnterpriseFormState } from "@lib/action";
import { Button } from "@components/ui/button";
import { useForm, useWatch } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@components/ui/select";
import { Textarea } from "@components/ui/textarea";
import { Input } from "@components/ui/input";
import { Switch } from "@components/ui/switch";
import { EnterpriseParams } from "@type/common";
import Link from "next/link";
import { AssetsUploader } from "@components/business/AssetsUploader";
import { useTransition, useState } from "react";
import { GlobalLoading } from "@components/business/globalLoading";
import { Icons } from "@components/ui/icon";
import { TAG_TYPES } from "@constant/index";

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
  const [contactInput, setContactInput] = useState("");
  const [isAddContact, setIsAddContact] = useState<boolean>(false);

  const form = useForm({
    defaultValues: defaultValues || {
      name: "",
      logo: "",
      website: "",
      address: "",
      phoneNumber: "",
      invoice: "",
      remark: "",
      email: "",
      tags: [],
      tagsTypes: [],
      isEligibleForCashback: false,
      contacts: [],
    },
  });

  const tagsTypes = useWatch({
    control: form.control,
    name: "tagsTypes",
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
        throw e;
      }
    });
  });

  const handleKeyDownInTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (tagInput.trim() !== "") {
        const currentTags = form.getValues("tags") || [];
        const currentTagsTypes = form.getValues("tagsTypes") || [];

        if (!currentTags.includes(tagInput.trim())) {
          form.setValue("tags", [...currentTags, tagInput.trim()]);
          form.setValue("tagsTypes", [...currentTagsTypes, 0]);
        }
        setTagInput("");
        setIsAddTag(false);
      }
    }
  };

  const handleKeyDownInContact = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (contactInput.trim() !== "") {
        const currentContacts = form.getValues("contacts") || [];
        if (!currentContacts.includes(contactInput.trim())) {
          form.setValue("contacts", [...currentContacts, contactInput.trim()]);
        }
        setContactInput("");
        setIsAddContact(false);
      }
    }
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues("tags") || [];
    const currentTagsTypes = form.getValues("tagsTypes") || [];

    form.setValue(
      "tags",
      currentTags.filter((_, i) => i !== index)
    );
    form.setValue(
      "tagsTypes",
      currentTagsTypes.filter((_, i) => i !== index)
    );
  };

  const removeContact = (index: number) => {
    const currentContacts = form.getValues("contacts") || [];

    form.setValue(
      "contacts",
      currentContacts.filter((_, i) => i !== index)
    );
  };

  const handleTagTypeChange = (value: number, index: number) => {
    const currentTagsTypes = form.getValues("tagsTypes") || [];
    const newTagsTypes = [...currentTagsTypes];
    newTagsTypes[index] = value;
    form.setValue("tagsTypes", newTagsTypes);
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
          name="invoice"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel className="!text-inherit">企业发票：</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="请输入企业发票" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="remark"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel className="!text-inherit">企业备注：</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="请输入企业备注信息"
                  {...field}
                />
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
                <AssetsUploader
                  defaultAssetsUrl={field.value}
                  onUploadSuccess={(url) => field.onChange(url)}
                  acceptTypes="image/*"
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
                    onKeyDown={handleKeyDownInTag}
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
                    className="flex items-center gap-1 bg-[#f2f4f6] px-2 py-1 rounded-md"
                  >
                    <span
                      className={clsx("px-1.5 py-0.5", {
                        "text-[#141414] bg-[#f5f7fa]": tagsTypes?.[index] === 0,
                        "text-[#188038] bg-[#E6F4EA]": tagsTypes?.[index] === 1,
                        "text-[#1A73E8] bg-[#E8F0FE]": tagsTypes?.[index] === 2,
                        "text-[#E37400] bg-[#FFF4E5]": tagsTypes?.[index] === 3,
                        "text-[#9334E6] bg-[#F3E8FD]": tagsTypes?.[index] === 4,
                      })}
                    >
                      {tag}
                    </span>
                    <Select
                      value={(tagsTypes?.[index] ?? 0).toString()}
                      onValueChange={(value) =>
                        handleTagTypeChange(Number(value), index)
                      }
                    >
                      <SelectTrigger className="w-[88px] ml-3 bg-[#fdfeff]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TAG_TYPES.map((tagType, j) => (
                          <SelectItem key={tagType} value={j.toString()}>
                            {tagType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      className="hover:bg-transparent"
                      onClick={() => removeTag(index)}
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
          name="tagsTypes"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input {...field} value={field.value?.toString() ?? ""} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contacts"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel className="!text-inherit">企业联系人：</FormLabel>
              <div className="flex flex-col gap-2 mb-2">
                {isAddContact ? (
                  <Input
                    value={contactInput}
                    onChange={(e) => setContactInput(e.target.value)}
                    onKeyDown={handleKeyDownInContact}
                    placeholder="输入企业联系人, 按回车添加"
                    className="w-full"
                  />
                ) : (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsAddContact(true)}
                  >
                    <Icons.Plus className="w-4 h-4" />
                  </Button>
                )}
                {field.value?.map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-1 bg-gray-100 px-2 py-1 rounded-md"
                  >
                    <span>{contact}</span>
                    <Button
                      className="hover:bg-transparent"
                      onClick={() => removeContact(index)}
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
