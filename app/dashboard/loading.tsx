import { Skeleton } from "@components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-4 flex flex-col gap-4">
      {Array.from({ length: 11 }).map((_, index) => (
        <Skeleton className="w-full h-10 bg-gray-100" key={index} />
      ))}
    </div>
  );
}
