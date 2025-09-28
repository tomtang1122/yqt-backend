import { fetchRebate, MAX_ITEMS_PER_PAGE } from "@lib/fetchData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@components/ui/pagination";
import { DeleteButton } from "@components/business/DeleteButton";
import { ViewDetailButton } from "@components/business/ViewDetailButton";
import { deleteRebateAction } from "@lib/action";

export async function RebateList({
  currentPage,
  query,
}: {
  currentPage: number;
  query?: string;
}) {
  const { total = 0, rebateOrders = [] } = await fetchRebate({
    pageNumber: currentPage,
    keyword: query,
  });
  const totalPage = Math.ceil(total / MAX_ITEMS_PER_PAGE);

  return (
    <div className="min-w-[1280px]">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[120px]">序号</TableHead>
            <TableHead>工单ID</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rebateOrders?.map((rebate, index) => (
            <TableRow key={rebate.orderID}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{rebate.orderID}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <ViewDetailButton
                    orderID={rebate.orderID}
                    title="贴息工单详情"
                    type="rebate"
                  />
                  <DeleteButton
                    id={rebate.orderID}
                    onDelete={deleteRebateAction}
                    title="是否确定删除当前工单"
                    description="删除后，当前工单将无法使用，请谨慎操作。"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={`${
                currentPage <= 1 ? "pointer-events-none opacity-50" : ""
              }`}
              href={`/dashboard/finance/rebate?page=${currentPage - 1}`}
            />
          </PaginationItem>
          <PaginationItem>
            <span>{currentPage}</span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              className={`${
                currentPage >= totalPage ? "pointer-events-none opacity-50" : ""
              }`}
              href={`/dashboard/finance/rebate?page=${currentPage + 1}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
