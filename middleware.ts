// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  const isPrivateRoute =
    pathname.startsWith("/dictionary") ||
    pathname.startsWith("/recommend") ||
    pathname.startsWith("/training");

    if (pathname === "/") {
    if (accessToken) {
      return NextResponse.redirect(new URL("/dictionary", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (!accessToken && isPrivateRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

    if (accessToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/dictionary", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dictionary/:path*",
    "/recommend/:path*",
    "/training/:path*",
    "/login",
    "/register",
  ],
};