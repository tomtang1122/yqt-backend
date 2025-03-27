import { fetchEnterprise, MAX_ENTERPRISE_PER_PAGE } from "@lib/fetchData";
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
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";
import { DeleteEnterprise } from "@components/business/DeleteEnterprise";

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
  const totalPage = Math.ceil(total / MAX_ENTERPRISE_PER_PAGE);

  return (
    <div>
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
            <TableHead>支持返现</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enterprises?.map((enterprise, index) => (
            <TableRow key={enterprise.enterpriseID}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <Avatar>
                  {enterprise.logo && (
                    <AvatarImage src={enterprise.logo} alt="企业 logo" />
                  )}
                  <AvatarFallback>LG</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{enterprise.name}</TableCell>
              <TableCell>{enterprise.website}</TableCell>
              <TableCell>{enterprise.address}</TableCell>
              <TableCell>{enterprise.email}</TableCell>
              <TableCell>{enterprise.phoneNumber}</TableCell>
              <TableCell>
                {enterprise.isEligibleForCashback ? "是" : "否"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <Button variant="ghost" size="icon">
                    <Link
                      href={`/dashboard/enterprise/${enterprise.enterpriseID}/edit`}
                    >
                      <Icons.Pencil className="w-4 h-4" />
                    </Link>
                  </Button>
                  <DeleteEnterprise enterpriseID={enterprise.enterpriseID} />
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
              href={`/dashboard/enterprise?page=${currentPage - 1}`}
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
              href={`/dashboard/enterprise?page=${currentPage + 1}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
