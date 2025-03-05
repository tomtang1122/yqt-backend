import { Suspense } from "react";

async function fetchDashboardData() {
  // 模拟 API 调用，等待 4 秒
  await new Promise((resolve) => setTimeout(resolve, 4000));
  return {
    title: "仪表板",
    data: "这是从服务器加载的数据",
  };
}

// 将异步内容抽取为单独的组件
async function DashboardContent() {
  const data = await fetchDashboardData();

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h2 className="text-xl font-bold mb-4">{data.title}</h2>
      <p>{data.data}</p>
    </div>
  );
}

// 局部 loading 组件
function LoadingContent() {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        <p>加载数据中...</p>
      </div>
    </div>
  );
}

export default function DashboardMainPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">仪表板页面</h1>

      {/* 这部分内容会立即显示 */}
      <div className="mb-6">
        <p>这是一些静态内容，会立即显示</p>
      </div>

      {/* 异步加载的内容区域 */}
      <Suspense fallback={<LoadingContent />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
