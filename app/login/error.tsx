"use client";

import { Button } from "@components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6">
      <h2 className="text-xl font-bold">发生错误</h2>
      <p className="text-gray-400 text-sm">错误信息: {error.message}</p>
      <Button onClick={() => reset()}>重新尝试</Button>
    </div>
  );
}
