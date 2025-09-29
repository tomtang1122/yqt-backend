import clsx from "clsx";
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
import { buildQueryString } from "@lib/utils";

export async function RebateList({
  currentPage,
  query,
  status,
  startTime,
  endTime,
}: {
  currentPage: number;
  query?: string;
  status?: number;
  startTime?: number;
  endTime?: number;
}) {
  const { total = 0, rebateOrders = [] } = await fetchRebate({
    pageNumber: currentPage,
    keyword: query,
    status,
    startCreateTime: startTime,
    endCreateTime: endTime,
  });
  const totalPage = Math.ceil(total / MAX_ITEMS_PER_PAGE);

  return (
    <div className="min-w-[1280px]">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[120px]">序号</TableHead>
            <TableHead>工单ID</TableHead>
            <TableHead>创建日期</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rebateOrders?.map((rebate, index) => (
            <TableRow key={rebate.orderID}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell
                className={clsx({
                  "text-[#1A73E8] font-bold": rebate.status === 0,
                  "text-gray-600": rebate.status === 1,
                })}
              >
                {rebate.orderID}
              </TableCell>
              <TableCell>
                {new Date(rebate.createTime).toLocaleString()}
              </TableCell>
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
              href={`/dashboard/finance/rebate?${buildQueryString({
                query,
                status,
                startTime,
                endTime,
                page: currentPage - 1,
              })}`}
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
              href={`/dashboard/finance/rebate?${buildQueryString({
                query,
                status,
                startTime,
                endTime,
                page: currentPage + 1,
              })}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
