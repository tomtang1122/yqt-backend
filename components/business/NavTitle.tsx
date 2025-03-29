"use client";

import { usePathname } from "next/navigation";
import { Icons } from "@components/ui/icon";
import Link from "next/link";

const items = [
  {
    condition: (pathname: string | null) => pathname === "/dashboard",
    title: <span>信息面板</span>,
  },
  {
    condition: (pathname: string | null) =>
      pathname === "/dashboard/enterprise",
    title: <span>企业列表</span>,
  },
  {
    condition: (pathname: string | null) =>
      pathname === "/dashboard/enterprise/create",
    title: (
      <>
        <Link href="/dashboard/enterprise">企业列表</Link>
        <Icons.ChevronRight className="w-4 h-4" />
        <span>创建企业</span>
      </>
    ),
  },
  {
    condition: (pathname: string | null) =>
      pathname?.includes("/dashboard/enterprise") && pathname.includes("/edit"),
    title: (
      <>
        <Link href="/dashboard/enterprise">企业列表</Link>
        <Icons.ChevronRight className="w-4 h-4" />
        <span>更新企业</span>
      </>
    ),
  },
];

export const NavTitle = () => {
  const pathname = usePathname();
  const currentItem = items.find((item) => item.condition(pathname));

  return (
    <p className="text-sm text-muted-foreground flex items-center gap-2">
      {currentItem?.title}
    </p>
  );
};
