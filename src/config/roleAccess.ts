import { cookieHandler } from "@/lib/services/cookieHandler";

export const roleAccessMap: Record<string, string[]> = {
  ADMINUSER: ["/admin", "/dashboard", "/workflows", "/portfolio"],
  ACCOUNT: ["/account", "/account/profile", "/account/settings"],
  PORTFOLIO: ["/portfolio", "/portfolio/view", "/portfolio/reports"],
  WORKFLOW: [
    "/workflow",
    "/workflow/tasks",
    "/workflow/processes",
    "/workflows",
  ],
  INQUIRY: ["/inquiry", "/inquiry/new", "/inquiry/history"],
};

export const defaultPages: Record<string, string> = {
  ADMINUSER: "/dashboard",
  ACCOUNT: "/account",
  PORTFOLIO: "/portfolio",
  WORKFLOW: "/workflow",
  INQUIRY: "/inquiry",
};

export const publicRoutes = [
  "/register",
  "/forgot-password",
  "/reset-password",
  "/api/login",
  "/api/refresh-token",
];

export const FALLBACK_DEFAULT_PAGE = "/login";

export function hasAccess(role: string, path: string): boolean {
  const allowedURIs = roleAccessMap[role] || [];
  return allowedURIs.some((uri) => path === uri || path.startsWith(uri + "/"));
}

export function getDefaultPage(token?: string): string {
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

    const userRole = payload.role.toUpperCase();
    return defaultPages[userRole];
  } catch {
    //TODO: Log error
    cookieHandler.clearAuthToken();
    return FALLBACK_DEFAULT_PAGE;
  }
}
