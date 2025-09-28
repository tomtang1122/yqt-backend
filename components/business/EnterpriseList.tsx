import { fetchEnterprise, MAX_ITEMS_PER_PAGE } from "@lib/fetchData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Icons } from "@components/ui/icon";
import { Button } from "@components/ui/button";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@components/ui/pagination";
import Image from "next/image";
import { DeleteButton } from "@components/business/DeleteButton";
import { deleteEnterpriseAction } from "@lib/action";
import { buildQueryString } from "@lib/utils";

export async function EnterpriseList({
  currentPage,
  query,
}: {
  currentPage: number;
  query?: string;
}) {
  const { total = 0, enterprises = [] } = await fetchEnterprise(
    currentPage,
    query
  );
  const totalPage = Math.ceil(total / MAX_ITEMS_PER_PAGE);

  return (
    <div className="min-w-[1280px]">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[120px]">序号</TableHead>
            <TableHead>企业logo</TableHead>
            <TableHead>企业名称</TableHead>
            <TableHead>企业网址</TableHead>
            <TableHead>企业地址</TableHead>
            <TableHead>企业邮箱</TableHead>
            <TableHead>企业电话</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enterprises?.map((enterprise, index) => (
            <TableRow key={enterprise.enterpriseID}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                {enterprise.logo && (
                  <Image
                    width={120}
                    height={120}
                    src={enterprise.logo}
                    alt="企业 logo"
                  />
                )}
              </TableCell>
              <TableCell>{enterprise.name}</TableCell>
              <TableCell>{enterprise.website}</TableCell>
              <TableCell>{enterprise.address}</TableCell>
              <TableCell>{enterprise.email}</TableCell>
              <TableCell>{enterprise.phoneNumber}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <Button variant="ghost" size="icon">
                    <Link
                      href={`/dashboard/enterprise/${enterprise.enterpriseID}/edit`}
                    >
                      <Icons.Pencil className="w-4 h-4" />
                    </Link>
                  </Button>
                  <DeleteButton
                    id={enterprise.enterpriseID}
                    onDelete={deleteEnterpriseAction}
                    title="是否确定删除当前企业"
                    description="删除后，当前企业将无法使用，请谨慎操作。"
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
              href={`/dashboard/enterprise?${buildQueryString({ query, page: currentPage - 1 })}`}
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
              href={`/dashboard/enterprise?${buildQueryString({ query, page: currentPage + 1 })}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
