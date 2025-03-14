"use client";

import { useTransition } from "react";
import { deleteEnterpriseAction } from "@lib/action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { GlobalLoading } from "@components/business/globalLoading";
import { Icons } from "@components/ui/icon";
import { Button } from "@components/ui/button";

export function DeleteEnterprise({ enterpriseID }: { enterpriseID?: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!enterpriseID) return;
    startTransition(async () => {
      await deleteEnterpriseAction(enterpriseID);
    });
  };

  return (
    <>
      {isPending && <GlobalLoading />}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Icons.Trash className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>是否确定删除当前企业</AlertDialogTitle>
            <AlertDialogDescription>
              删除后，当前企业将无法使用，请谨慎操作。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              确定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
