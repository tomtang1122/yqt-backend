import { EnterpriseList } from "@components/business/EnterpriseList";
import { Suspense } from "react";
import { Skeleton } from "@components/ui/skeleton";
import { Button } from "@components/ui/button";
import { Icons } from "@components/ui/icon";
import Link from "next/link";

export default function EnterpriseManagePage() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">企业列表</h1>
        <Button asChild>
          <Link href="/dashboard/enterprise/create">
            <Icons.Plus />
            创建企业
          </Link>
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-10 bg-gray-100" />
            <Skeleton className="w-full h-10 bg-gray-100" />
            <Skeleton className="w-full h-10 bg-gray-100" />
            <Skeleton className="w-full h-10 bg-gray-100" />
            <Skeleton className="w-full h-10 bg-gray-100" />
            <Skeleton className="w-full h-10 bg-gray-100" />
          </div>
        }
      >
        <EnterpriseList />
      </Suspense>
    </div>
  );
}
