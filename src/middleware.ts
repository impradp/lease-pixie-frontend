import { NextRequest, NextResponse } from "next/server";
import { cookieHandler } from "@/lib/services/cookieHandler";
import { publicRoutes, hasAccess, getDefaultPage } from "@/config/roleAccess";

export function middleware(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;

  const authToken = request.cookies.get("auth_token")?.value;

  if (!authToken && !pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    // If the user is on the login page and has a valid token, redirect to their default page
    if (pathname === "/login" && authToken) {
      try {
        return NextResponse.redirect(new URL(getDefaultPage(), request.url));
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", `Bearer ${authToken}`);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  try {
    if (!authToken) {
      throw new Error("No auth token found");
    }

    const payloadEncoded = authToken.split(".")[1];
    const payload = JSON.parse(
      Buffer.from(payloadEncoded, "base64").toString("utf-8")
    );
    const userRole = payload.role.toUpperCase();
    if (!hasAccess(userRole, pathname)) {
      return NextResponse.redirect(
        new URL(getDefaultPage(authToken), request.url)
      );
    }

    return NextResponse.next();
  } catch {
    //TODO: Log error
    cookieHandler.clearAuthToken();
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|css|js|svg|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
