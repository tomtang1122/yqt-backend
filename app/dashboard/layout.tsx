// import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const token = cookies().get('auth-token')
  const token = "123";
  if (!token) {
    redirect("/login");
  }

  // 验证 token 有效性
  try {
    // await getUserInfo(token.value);
  } catch {
    // cookies().delete("auth-token");
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex">
      <nav className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl mb-4">仪表板</h2>
        <ul>
          <li className="mb-2">
            <a href="/dashboard" className="hover:text-gray-300">
              查看信息
            </a>
          </li>
          <li className="mb-2">
            <a href="/dashboard/edit" className="hover:text-gray-300">
              修改信息
            </a>
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
