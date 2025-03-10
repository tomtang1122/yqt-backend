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
import { NavTitle } from "@components/business/NavTitle";
import { items } from "@lib/config";
import Link from "next/link";
import Image from "next/image";
import logo from "@assets/logo.png";
import { Logout } from "@components/business/Logout";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-4">
            <Image src={logo} alt="favicon" width={44} height={44} />
            <div className="flex flex-col gap-1">
              <span className="text-lg font-bold">云雀台</span>
              <span className="text-sm text-gray-500">后台管理系统</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>管理</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton asChild>
            <Logout />
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <main className="px-4 py-6 flex-1">
        <div className="flex h-5 items-center space-x-4">
          <SidebarTrigger />
          <Separator orientation="vertical" />
          <NavTitle />
        </div>
        <div className="my-8">{children}</div>
      </main>
    </SidebarProvider>
  );
}
