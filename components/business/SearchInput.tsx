"use client";

import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Icons } from "@components/ui/icon";
import { useDebouncedCallback } from "use-debounce";

interface SearchInputProps {
  placeholder: string;
}

export function SearchInput({ placeholder }: SearchInputProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams ?? {});
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    // 搜索时重置到第一页
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="max-w-[360px] relative flex-1">
      <Label htmlFor="search" className="sr-only">
        搜索
      </Label>
      <Input
        className="pl-8"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams?.get("query")?.toString()}
      />
      <Icons.Search
        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
        width={20}
        height={20}
      />
    </div>
  );
}
