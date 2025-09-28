import Link from "next/link";

export default function DashboardMainPage() {
  return (
    <div className="p-4 flex gap-8">
      <Link
        href="/dashboard/finance/procurement"
        className="border rounded-lg p-4 shadow-sm"
      >
        <h2 className="text-xl font-bold mb-4">额度工单</h2>
        <p>查看额度工单列表</p>
      </Link>
      <Link
        href="/dashboard/finance/rebate"
        className="border rounded-lg p-4 shadow-sm"
      >
        <h2 className="text-xl font-bold mb-4">贴息工单</h2>
        <p>查看贴息工单列表</p>
      </Link>
    </div>
  );
}
