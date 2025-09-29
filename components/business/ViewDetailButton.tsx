"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@components/ui/button";
import { Icons } from "@components/ui/icon";
import { GlobalLoading } from "@components/business/globalLoading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  updateProcurementStatusAction,
  updateRebateStatusAction,
} from "@lib/action";

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
    readAt: "初次查看日期",
    createTime: "创建日期",
    remark: "备注",

    // Procurement 字段
    vendor: "品牌厂商名称",
    integrator: "集成（代理）商名称",
    endCustomer: "终端客户名称",
    purchaseAmount: "采购金额（万元）",
    paymentTermDays: "付款期限(天)",
    originOrgName: "业务发起机构",
    contactName: "联系人姓名",
    contactPhone: "联系电话",
    contactEmail: "联系邮箱",

    // Rebate 字段
    procurementOrderID: "采购订单号",
    contractNumber: "合同编号",
    invoiceAmount: "发票金额（万元）",
    invoiceDate: "发票日期",
    customerName: "申请人姓名",
    customerBankAccount: "申请人银行账户",
  };
  return labelMap[key] || key;
};

const getDisplayFields = (data: unknown) => {
  if (!data || typeof data !== "object") return [];

  // 显示所有字段，不排除任何字段
  return Object.entries(data as Record<string, unknown>)
    .filter(([key]) => key !== "status" && key !== "processedAt")
    .map(([key, value]) => ({
      label: getFieldLabel(key),
      value: formatValue(value as string | number, key),
    }));
};

export function ViewDetailButton({
  orderID,
  title,
  type,
}: ViewDetailButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [detail, setDetail] = useState<unknown>(null);
  const [isPending, startTransition] = useTransition();
  const [hasViewed, setHasViewed] = useState(false);

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
        // 1. 获取详情数据
        const data = await fetchDetail(orderID);
        setDetail(data);
        setIsOpen(true);

        // 2. 检查状态，只有未读时才标记为已查看
        if (data?.status === 0) {
          setHasViewed(true);
        }
      } catch (error) {
        console.error("Failed to fetch detail:", error);
      }
    });
  };

  // 当Modal关闭时清空数据并更新状态
  useEffect(() => {
    const updateStatus = async () => {
      try {
        if (type === "procurement") {
          await updateProcurementStatusAction(orderID, 1); // 更新状态并刷新页面
        } else {
          await updateRebateStatusAction(orderID, 1); // 更新状态并刷新页面
        }
      } catch (statusError) {
        console.error("Failed to update status:", statusError);
      }
    };
    // 关闭窗口时，如果已经查看过详情，则更新状态为已读并刷新页面
    if (!isOpen && hasViewed) {
      updateStatus();
      setHasViewed(false); // 重置标记
    }
  }, [isOpen, hasViewed, orderID, type]);

  return (
    <>
      {isPending && <GlobalLoading />}
      <Button variant="ghost" size="icon" onClick={handleClick}>
        <Icons.Eye className="w-4 h-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>查看工单详细信息</DialogDescription>
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
