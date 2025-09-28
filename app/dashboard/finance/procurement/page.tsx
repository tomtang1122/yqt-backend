import { ProcurementList } from "@components/business/ProcurementList";
import { Suspense } from "react";
import { Skeleton } from "@components/ui/skeleton";
import { SearchInput } from "@components/business/SearchInput";
import { Metadata } from "next";

export default async function ProcurementPage(props: {
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
      <h1 className="text-2xl font-bold">额度工单列表</h1>

      <div className="flex items-center justify-between my-6 gap-4">
        <SearchInput placeholder="搜索额度工单" />
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col gap-4">
            {Array.from({ length: 11 }).map((_, index) => (
              <Skeleton className="w-full h-10 bg-gray-100" key={index} />
            ))}
          </div>
        }
      >
        <ProcurementList currentPage={currentPage} query={query} />
      </Suspense>
    </div>
  );
}

export const metadata: Metadata = {
  title: "额度工单列表",
};
