/**
 * Maps roles to their accessible routes
 */
export const roleAccessMap: Record<string, string[]> = {
  // Defines routes accessible by each role
  ADMINUSER: [
    "/admin",
    "/dashboard",
    "/workflows",
    "/portfolio",
    "/account",
    "/vendors",
    "/property",
    "/settings",
  ],
  READONLYADMINUSER: [
    "/admin",
    "/dashboard",
    "/workflows",
    "/portfolio",
    "/account",
    "/settings",
  ],
  ACCOUNTUSER: [
    "/account",
    "/account/profile",
    "/account/settings",
    "/portfolio",
    "/property",
    "/vendors",
  ],
  PORTFOLIOUSER: ["/portfolio", "/portfolio/view", "/portfolio/reports"],
  PLATFORMUSER: ["/portfolio", "/portfolio/view", "/portfolio/reports"],
  WORKFLOW: [
    "/workflow",
    "/workflow/tasks",
    "/workflow/processes",
    "/workflows",
  ],
  INQUIRY: ["/inquiry", "/inquiry/new", "/inquiry/history"],
};

/**
 * Defines default landing pages for each role
 */
export const defaultPages: Record<string, string> = {
  // Specifies default page for each role
  READONLYADMINUSER: "/dashboard",
  ADMINUSER: "/dashboard",
  ACCOUNTUSER: "/account",
  PORTFOLIO: "/portfolio",
  WORKFLOW: "/workflow",
  INQUIRY: "/inquiry",
};

/**
 * Lists publicly accessible routes
 */
export const publicRoutes = [
  // Routes accessible without authentication
  "/reset",
  "/logout",
  "/forgot-password",
  "/reset-password",
  "/api/login",
  "/api/refresh-token",
  "/property/create",
];

/**
 * Fallback page for invalid or missing roles
 */
export const FALLBACK_DEFAULT_PAGE = "/login"; // Default redirect for unauthenticated users

/**
 * Checks if a role has access to a specific path
 * @param role - The user's role
 * @param path - The requested path
 * @returns boolean - Whether the role has access
 */
export function hasAccess(role: string, path: string): boolean {
  // Verifies if role can access path
  const allowedURIs = roleAccessMap[role] || [];
  return allowedURIs.some((uri) => path === uri || path.startsWith(uri + "/"));
}

/**
 * Retrieves the default page for a user based on their token
 * @param token - Optional authentication token
 * @returns string - The default page URL
 */
export function getDefaultPage(token?: string): string {
  // Determines default page from token
  try {
    let authToken: string | undefined;
    if (token) {
      authToken = token;
    } else if (typeof document !== "undefined") {
      authToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];
    }

    if (
      !authToken ||
      typeof authToken !== "string" ||
      authToken.trim() === ""
    ) {
      return "/login";
    }

    const payloadEncoded = authToken.split(".")[1];
    const payload = JSON.parse(
      Buffer.from(payloadEncoded, "base64").toString("utf-8")
    );

    const userRoles = payload.roles;
    if (!userRoles || !defaultPages[userRoles[0].toUpperCase()]) {
      return FALLBACK_DEFAULT_PAGE;
    }

    return defaultPages[userRoles[0].toUpperCase()];
  } catch {
    // Returns fallback page on error
    return FALLBACK_DEFAULT_PAGE;
  }
}
