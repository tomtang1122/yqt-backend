"use client";
import { usePathname } from "next/navigation";
import { items } from "./config";

export function NavTitle() {
  const pathname = usePathname();
  const currentItem = items.find((item) => item.url === pathname);
  return (
    <p className="text-sm text-muted-foreground">
      {currentItem?.title || "信息面板"}
    </p>
  );
}
