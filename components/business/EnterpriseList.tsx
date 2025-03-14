import { fetchEnterprise, MAX_ENTERPRISE_PER_PAGE } from "@lib/fetchData";
import { deleteEnterpriseAction } from "@lib/action";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { getProxyImageUrl } from "@lib/utils";

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
            <TableHead>企业名称</TableHead>
            <TableHead>企业logo</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enterprises?.map((enterprise, index) => (
            <TableRow key={enterprise.enterpriseID}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{enterprise.name}</TableCell>
              <TableCell>
                <Avatar>
                  <AvatarImage
                    src={getProxyImageUrl(enterprise.logo || "")}
                    alt="企业 logo"
                  />
                  <AvatarFallback>LG</AvatarFallback>
                </Avatar>
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Icons.Trash className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          是否确定删除当前企业
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          删除后，当前企业将无法使用，请谨慎操作。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <form
                          action={deleteEnterpriseAction.bind(
                            null,
                            enterprise.enterpriseID
                          )}
                        >
                          <AlertDialogAction type="submit">
                            确定
                          </AlertDialogAction>
                        </form>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
