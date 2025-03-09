import { EnterpriseList } from "@components/business/EnterpriseList";
import { Suspense } from "react";
import { Skeleton } from "@components/ui/skeleton";

export default function EnterpriseManagePage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">企业列表</h1>
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
