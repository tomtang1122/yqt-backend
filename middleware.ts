import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token");

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/login")) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
