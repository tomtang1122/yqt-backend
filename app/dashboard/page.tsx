import { Suspense } from "react";

async function fetchDashboardData(time: number) {
  await new Promise((resolve) => setTimeout(resolve, time));
}

async function UserDashboardContent() {
  await fetchDashboardData(2500);

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h2 className="text-xl font-bold mb-4">用户</h2>
      <p>用户的一些基本信息</p>
    </div>
  );
}

async function EnterpriseDashboardContent() {
  await fetchDashboardData(4000);

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h2 className="text-xl font-bold mb-4">企业</h2>
      <p>企业的一些基本信息</p>
    </div>
  );
}

function LoadingContent(props: { loadingMessage: string }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        <p>{props.loadingMessage}</p>
      </div>
    </div>
  );
}

export default function DashboardMainPage() {
  return (
    <div className="p-4 flex gap-8">
      <Suspense fallback={<LoadingContent loadingMessage="加载个人信息..." />}>
        <UserDashboardContent />
      </Suspense>
      <Suspense fallback={<LoadingContent loadingMessage="加载企业信息..." />}>
        <EnterpriseDashboardContent />
      </Suspense>
    </div>
  );
}
