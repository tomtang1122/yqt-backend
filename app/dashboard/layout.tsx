// import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@components/ui/sidebar";
import { Separator } from "@components/ui/separator";
import { NavTitle } from "./NavTitle";
import { items } from "./config";

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
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>后台管理系统</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>操作</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>退出登录</SidebarFooter>
      </Sidebar>
      <main className="p-4">
        <div className="flex h-5 items-center space-x-4">
          <SidebarTrigger />
          <Separator orientation="vertical" />
          <NavTitle />
        </div>
        <div className="my-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
