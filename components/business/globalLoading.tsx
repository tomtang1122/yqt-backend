import { Icons } from "@components/ui/icon";

export const GlobalLoading = () => {
  return (
    <div className="flex flex-col gap-4 fixed inset-0 items-center justify-center bg-gray-100 opacity-50 z-[1000]">
      <Icons.Loader className="w-10 h-10 animate-spin" />
      加载中...
    </div>
  );
};
