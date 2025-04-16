"use client";

import { exportToExcel } from "@lib/utils";
import { fetchAllEnterprise } from "@lib/fetchData";
import { Icons } from "@components/ui/icon";
import { Button } from "@components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/tooltip";

export function ExportEnterpriseToExcel() {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            onClick={async () => {
              const { enterprises = [] } = await fetchAllEnterprise();
              exportToExcel(enterprises);
            }}
          >
            <Icons.Download className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>导出企业列表</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
