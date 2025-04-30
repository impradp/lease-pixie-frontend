import { NextRequest, NextResponse } from "next/server";
import { decodeToken } from "../utils/tokenUtils";
import { getDefaultPage } from "@/config/roleAccess";

/**
 * Handles routing for the login path based on authentication status
 * @param request - The incoming request object
 * @param authToken - The authentication token from cookies
 * @returns NextResponse - The response for the login path
 */
export function executeAuthMiddleware(
  request: NextRequest,
  authToken: string | undefined
) {
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
