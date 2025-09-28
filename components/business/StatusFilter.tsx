"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { Label } from "@components/ui/label";

interface StatusFilterProps {
  className?: string;
}

export function StatusFilter({ className }: StatusFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentStatus = searchParams?.get("status") || "all";

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams ?? {});
    
    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    
    // 状态改变时重置到第一页
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={className}>
      <RadioGroup
        value={currentStatus}
        onValueChange={handleStatusChange}
        className="flex gap-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="all" />
          <Label htmlFor="all" className="cursor-pointer">
            所有
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1" id="read" />
          <Label htmlFor="read" className="cursor-pointer">
            已读
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="0" id="unread" />
          <Label htmlFor="unread" className="cursor-pointer">
            未读
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
