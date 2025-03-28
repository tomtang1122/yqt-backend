import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("admin-token");
  const { pathname, basePath } = request.nextUrl;
  console.log("~~~~~~~~~~~~~ pathname:", pathname);
  console.log("~~~~~~~~~~~~~ basePath:", basePath);

  if (pathname === "/") {
    return token
      ? NextResponse.redirect(new URL(`${basePath}/dashboard`, request.url))
      : NextResponse.redirect(new URL(`${basePath}/login`, request.url));
  }

  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL(`${basePath}/login`, request.url));
  }

  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL(`${basePath}/dashboard`, request.url));
  }

  return NextResponse.next();
}

// 匹配需要处理的路由
export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
