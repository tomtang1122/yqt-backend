import { EnterpriseList } from "@components/business/EnterpriseList";
import { Suspense } from "react";
import { Skeleton } from "@components/ui/skeleton";
import { Button } from "@components/ui/button";
import { Icons } from "@components/ui/icon";
import Link from "next/link";
import { SearchInput } from "@components/business/SearchInput";
import { ExportEnterpriseToExcel } from "@components/business/ExportEnterpriseToExcel";
import { Metadata } from "next";

export default async function EnterpriseManagePage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">企业列表</h1>
      <div className="flex items-center justify-between my-6 gap-4">
        <SearchInput placeholder="搜索企业" />
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/dashboard/enterprise/create">
              <Icons.Plus />
              创建企业
            </Link>
          </Button>
          <ExportEnterpriseToExcel />
        </div>
      </div>

      <Suspense
        key={`${currentPage}-${query}`} // 如果没有key，只会在第一次加载fallback，不会在每次搜索时更新
        fallback={
          <div className="flex flex-col gap-4">
            {Array.from({ length: 11 }).map((_, index) => (
              <Skeleton className="w-full h-10 bg-gray-100" key={index} />
            ))}
          </div>
        }
      >
        <EnterpriseList currentPage={currentPage} query={query} />
      </Suspense>
    </div>
  );
}

export const metadata: Metadata = {
  title: "企业列表",
};
