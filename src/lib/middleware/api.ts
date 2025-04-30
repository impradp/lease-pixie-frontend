import { NextRequest, NextResponse } from "next/server";

export function executeAPIMiddleware(
  request: NextRequest,
  authToken: string | undefined
) {
  const pathname = request.nextUrl.pathname;
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
