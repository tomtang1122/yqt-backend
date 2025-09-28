import { ProcurementList } from "@components/business/ProcurementList";
import { Suspense } from "react";
import { Skeleton } from "@components/ui/skeleton";
import { SearchInput } from "@components/business/SearchInput";
import { StatusFilter } from "@components/business/StatusFilter";
import { Metadata } from "next";

export default async function ProcurementPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    status?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const status = searchParams?.status ? Number(searchParams.status) : undefined;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">额度工单列表</h1>

      <div className="flex items-center my-6 gap-8">
        <SearchInput placeholder="搜索额度工单" />
        <StatusFilter />
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
        <ProcurementList
          currentPage={currentPage}
          query={query}
          status={status}
        />
      </Suspense>
    </div>
  );
}

export const metadata: Metadata = {
  title: "额度工单列表",
};
