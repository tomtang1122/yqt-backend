import { fetchEnterprise } from "@lib/fetchData";
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

export async function EnterpriseList() {
  const { enterprises = [] } = await fetchEnterprise();

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className="w-[200px]">序号</TableHead>
          <TableHead>企业名称</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {enterprises.map((enterprise, index) => (
          <TableRow key={enterprise.enterpriseID}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{enterprise.name}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <Button variant="ghost" size="icon">
                  <Link href={`/dashboard/enterprise/create`}>
                    <Icons.Pencil className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon">
                  <Icons.Trash className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
