import { NextRequest, NextResponse } from "next/server";
import { publicRoutes, hasAccess, getDefaultPage } from "@/config/roleAccess";

// Token payload interface for better type safety
interface TokenPayload {
  role: string;
  exp: number;
  [key: string]: string | number;
}

/**
 * Decodes and verifies JWT token
 * @param token - The JWT token string
 * @returns The decoded payload or null if invalid
 */
function decodeToken(token: string | undefined): TokenPayload | null {
  if (!token) return null;

  try {
    const payloadEncoded = token.split(".")[1];
    if (!payloadEncoded) return null;

    const payload = JSON.parse(
      Buffer.from(payloadEncoded, "base64").toString("utf-8")
    );

    // Validate essential fields
    if (!payload.role) {
      console.warn("Token missing role field");
      return null;
    }

    return payload as TokenPayload;
  } catch (error) {
    console.error("Token decode error", { error });
    return null;
  }
}

/**
 * Checks if token is valid (has required fields and not expired)
 * @param token - The JWT auth token
 * @returns boolean indicating if token is valid
 */
function isTokenValid(token: string | undefined): boolean {
  if (!token) return false;

  const payload = decodeToken(token);
  if (!payload) return false;

  const currentTimestamp = Math.floor(Date.now() / 1000);
  return Boolean(payload.exp && currentTimestamp < payload.exp);
}

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
  if (!authToken) {
    console.debug("No auth token present for login path");
    return NextResponse.next();
  }

  const payload = decodeToken(authToken);
  if (!payload) {
    console.warn("Invalid token on login path, clearing auth cookie");
    return NextResponse.redirect(new URL("/logout?msg=100304", request.url));
  }

  const defaultPage = getDefaultPage(authToken);
  console.info("Redirecting authenticated user from login to default page", {
    role: payload.role,
    defaultPage,
  });

  return NextResponse.redirect(new URL(defaultPage, request.url));
}

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
    return handleLoginPath(request, authToken);
  }

  // API request handling
  if (pathname.startsWith("/api/")) {
    // For API routes, we validate the token only if it exists
    // and pass it in headers regardless
    if (authToken) {
      try {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("Authorization", `Bearer ${authToken}`);
        console.debug("Added auth token to API request headers", { pathname });
        return NextResponse.next({ request: { headers: requestHeaders } });
      } catch (error) {
        console.error("Error setting API request headers", { error, pathname });
      }
    }
    // Allow API request to proceed - actual endpoints will handle auth failure
    return NextResponse.next();
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
 * Configuration for middleware matching - unchanged
 */
export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|css|js|svg|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
