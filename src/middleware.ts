import { NextRequest, NextResponse } from "next/server";
import { publicRoutes, hasAccess, getDefaultPage } from "@/config/roleAccess";
import { executeAPIMiddleware } from "./lib/middleware/api";
import { executeAuthMiddleware } from "./lib/middleware/auth";
import { decodeToken, isTokenValid } from "./lib/utils/tokenUtils";

/**
 * Core middleware function to handle authentication and authorization
 * @param request - The incoming request object
 * @returns NextResponse based on auth status and route rules
 */
export function middleware(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;
  const authToken = request.cookies.get("auth_token")?.value;

  console.debug("Processing middleware request", { pathname });

  // Handle public routes first (most efficient check)
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    console.debug("Accessing public route", { pathname });
    return NextResponse.next();
  }

  // Special handling for login path
  if (pathname.startsWith("/login")) {
    return executeAuthMiddleware(request, authToken);
  }

  // API request handling
  if (pathname.startsWith("/api/")) {
    return executeAPIMiddleware(request, authToken);
  }

  // Main application routes: validate token for all non-public routes
  // that aren't API routes or login
  if (!authToken) {
    console.info("No auth token found, redirecting to login", { pathname });
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Validate token for protected routes
  if (!isTokenValid(authToken)) {
    console.warn(
      "Invalid or expired token, clearing and redirecting to login",
      {
        pathname,
      }
    );
    return NextResponse.redirect(new URL("/logout?msg=100304", request.url));
  }

  // Check role-based access
  const payload = decodeToken(authToken)!; // We know it's valid at this point
  const userRole = payload.role.toUpperCase();

  if (!hasAccess(userRole, pathname)) {
    console.warn("User lacks permission for route", {
      role: userRole,
      pathname,
    });
    return NextResponse.redirect(
      new URL(getDefaultPage(authToken), request.url)
    );
  }

  console.debug("Access granted", { role: userRole, pathname });
  return NextResponse.next();
}

/**
 * Configuration for middleware matching
 */
export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|css|js|svg|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
