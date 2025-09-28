"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@components/ui/button";
import { Icons } from "@components/ui/icon";
import { GlobalLoading } from "@components/business/globalLoading";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { fetchProcurementById, fetchRebateById } from "@lib/fetchData";

interface ViewDetailButtonProps {
  orderID: string;
  title: string;
  type: "procurement" | "rebate";
}

const formatValue = (value: string | number, key: string) => {
  if (typeof value === "number") {
    // 根据字段名称判断是否为时间戳
    const timeFields = ["readAt", "processedAt", "createTime", "invoiceDate"];
    if (timeFields.includes(key)) {
      return new Date(value).toLocaleString();
    }
    return value.toString();
  }
  return value;
};

const getFieldLabel = (key: string) => {
  const labelMap: Record<string, string> = {
    // 通用字段
    orderID: "工单ID",
    status: "状态",
    readAt: "读取时间",
    processedAt: "处理时间",
    createTime: "创建时间",
    remark: "备注",

    // Procurement 字段
    vendor: "供应商",
    integrator: "集成商",
    endCustomer: "终端客户",
    purchaseAmount: "采购金额",
    paymentTermDays: "付款期限(天)",
    originOrgName: "原始组织名称",
    contactName: "联系人姓名",
    contactPhone: "联系电话",
    contactEmail: "联系邮箱",

    // Rebate 字段
    procurementOrderID: "采购工单ID",
    contractNumber: "合同编号",
    invoiceAmount: "发票金额",
    invoiceDate: "发票日期",
    customerName: "客户名称",
    customerBankAccount: "客户银行账户",
  };
  return labelMap[key] || key;
};

const getDisplayFields = (data: unknown) => {
  if (!data || typeof data !== "object") return [];

  // 显示所有字段，不排除任何字段
  return Object.entries(data as Record<string, unknown>).map(
    ([key, value]) => ({
      label: getFieldLabel(key),
      value: formatValue(value as string | number, key),
    })
  );
};

export function ViewDetailButton({
  orderID,
  title,
  type,
}: ViewDetailButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [detail, setDetail] = useState<unknown>(null);
  const [isPending, startTransition] = useTransition();

  const fetchDetail = async (orderID: string) => {
    if (type === "procurement") {
      return await fetchProcurementById(orderID);
    } else {
      return await fetchRebateById(orderID);
    }
  };

  const handleClick = () => {
    startTransition(async () => {
      try {
        const data = await fetchDetail(orderID);
        setDetail(data);
        setIsOpen(true);
      } catch (error) {
        console.error("Failed to fetch detail:", error);
      }
    });
  };

  // 当Modal关闭时清空数据
  useEffect(() => {
    if (!isOpen) {
      setDetail(null);
    }
  }, [isOpen]);

  return (
    <>
      {isPending && <GlobalLoading />}
      <Button variant="ghost" size="icon" onClick={handleClick}>
        <Icons.Eye className="w-4 h-4" />
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          {Boolean(detail) && (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">字段</TableHead>
                    <TableHead>值</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getDisplayFields(detail).map((field, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {field.label}
                      </TableCell>
                      <TableCell>{field.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
