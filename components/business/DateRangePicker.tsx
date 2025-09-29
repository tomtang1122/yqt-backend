"use client";

import { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Calendar } from "@components/ui/calendar";
import { Button } from "@components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { Icons } from "@components/ui/icon";

import { format } from "date-fns";
import { cn } from "@lib/utils";

interface DateRangePickerProps {
  className?: string;
}

export function DateRangePicker({ className }: DateRangePickerProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [open, setOpen] = useState(false);

  // 从URL参数中获取日期范围
  const startTime = searchParams?.get("startTime");
  const endTime = searchParams?.get("endTime");

  const startDate = startTime ? new Date(parseInt(startTime)) : undefined;
  const endDate = endTime ? new Date(parseInt(endTime)) : undefined;

  const handleStartDateSelect = (date: Date | undefined) => {
    const params = new URLSearchParams(searchParams ?? {});

    if (date) {
      // 开始日期设置为当天的00:00:00
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const startTimestamp = startDate.getTime();
      params.set("startTime", startTimestamp.toString());
    } else {
      params.delete("startTime");
    }

    // 日期改变时重置到第一页
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    const params = new URLSearchParams(searchParams ?? {});

    if (date) {
      // 结束日期设置为当天的23:59:59.999
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      const endTimestamp = endDate.getTime();
      params.set("endTime", endTimestamp.toString());
    } else {
      params.delete("endTime");
    }

    // 日期改变时重置到第一页
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams ?? {});
    params.delete("startTime");
    params.delete("endTime");
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  const handleApply = () => {
    setOpen(false);
  };

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !startDate && !endDate && "text-muted-foreground"
            )}
          >
            <Icons.CalendarIcon className="mr-2 h-4 w-4" />
            {startDate && endDate ? (
              <>
                {format(startDate, "yyyy-MM-dd")} -{" "}
                {format(endDate, "yyyy-MM-dd")}
              </>
            ) : startDate ? (
              `${format(startDate, "yyyy-MM-dd")} - 结束日期`
            ) : endDate ? (
              `开始日期 - ${format(endDate, "yyyy-MM-dd")}`
            ) : (
              "选择日期范围"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <div className="p-3">
              <div className="text-sm font-medium mb-2">开始日期</div>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateSelect}
                disabled={(date) => {
                  // 如果已选择结束日期，开始日期不能晚于结束日期
                  if (endDate) {
                    return date > endDate;
                  }
                  return false;
                }}
                className="rounded-md border"
              />
            </div>
            <div className="p-3">
              <div className="text-sm font-medium mb-2">结束日期</div>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateSelect}
                disabled={(date) => {
                  // 如果已选择开始日期，结束日期不能早于开始日期
                  if (startDate) {
                    return date < startDate;
                  }
                  return false;
                }}
                className="rounded-md border"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 p-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="text-xs"
            >
              清除
            </Button>
            <Button size="sm" onClick={handleApply} className="text-xs">
              关闭
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
