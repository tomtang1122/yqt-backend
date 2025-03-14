"use client";

import { useTransition } from "react";
import { Icons } from "@components/ui/icon";
import { Button } from "@components/ui/button";
import { logoutAction } from "@lib/action";
import { GlobalLoading } from "@components/business/globalLoading";

export const Logout = () => {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <>
      {isPending && <GlobalLoading />}
      <Button variant="ghost" onClick={handleLogout} disabled={isPending}>
        <Icons.Power />
        <span>退出登录</span>
      </Button>
    </>
  );
};
