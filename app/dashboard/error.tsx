"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@lib/action";
import { RECAPTCHA_ERROR } from "@lib/config";
import { Button } from "@components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await logoutAction();
    };
    if (error.message === RECAPTCHA_ERROR) {
      redirect();
    }
  }, [error.message, router]);

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6">
      <h2 className="text-xl font-bold">发生错误</h2>
      <p className="text-gray-400 text-sm">错误信息: {error.message}</p>
      {error.message === RECAPTCHA_ERROR ? (
        <>
          <p>可能是登录信息过期，请重新登录</p>
          <p>正在跳转登录页面...</p>
        </>
      ) : (
        <Button onClick={() => reset()}>重新尝试</Button>
      )}
    </div>
  );
}
