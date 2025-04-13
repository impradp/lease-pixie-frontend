import { NextRequest, NextResponse } from "next/server";
import { cookieHandler } from "@/lib/services/cookieHandler";
import { publicRoutes, hasAccess, getDefaultPage } from "@/config/roleAccess";

/**
 * Handles routing for the login path based on authentication status
 * @param request - The incoming request object
 * @param authToken - The authentication token from cookies
 * @returns NextResponse - The response for the login path
 */
function handleLoginPath(
  request: NextRequest,
  authToken: string | undefined
): NextResponse {
  // Manages login path redirection
  if (authToken) {
    try {
      const payloadEncoded = authToken.split(".")[1];
      const payload = JSON.parse(
        Buffer.from(payloadEncoded, "base64").toString("utf-8")
      );
      if (!payload.role) throw new Error("Invalid token: missing role");
      return NextResponse.redirect(
        new URL(getDefaultPage(authToken), request.url)
      );
    } catch {
      cookieHandler.clearAuthToken();
      return NextResponse.next();
    }
  }
  return NextResponse.next();
}

/**
 * Middleware to handle authentication and authorization for routes
 * @param request - The incoming request object
 * @returns NextResponse - The response based on auth and access rules
 */
export function middleware(request: NextRequest): NextResponse {
  // Processes requests for auth and access control
  const pathname = request.nextUrl.pathname;
  const authToken = request.cookies.get("auth_token")?.value;

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    // Allows access to public routes
    return NextResponse.next();
  }

  if (!authToken && !pathname.startsWith("/login")) {
    // Redirects unauthenticated users to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/login")) {
    // Handles login path routing
    return handleLoginPath(request, authToken);
  }

  if (pathname.startsWith("/api/")) {
    // Adds auth token to API request headers
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
      // Redirects if user lacks access
      return NextResponse.redirect(
        new URL(getDefaultPage(authToken), request.url)
      );
    }

    return NextResponse.next();
  } catch {
    // Handles invalid token by clearing it and redirecting to login
    cookieHandler.clearAuthToken();
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

/**
 * Configuration for middleware matching
 */
export const config = {
  // Defines routes for middleware application
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|css|js|svg|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
