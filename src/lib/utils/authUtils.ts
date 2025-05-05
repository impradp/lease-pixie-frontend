/**
 * Utility functions to parse JWT tokens and check user roles
 */
import { cookieHandler } from "@/lib/services/cookieHandler";
import { hasAccess } from "@/config/roleAccess";

interface JWTPayload {
  roles?: string[];
  permissions?: string[];
  [key: string]: unknown;
}

/**
 * Parse JWT token and extract payload
 * @param token - The JWT token string
 * @returns Decoded token payload or null if invalid
 */
export function parseToken(token: string | undefined): JWTPayload | null {
  if (!token) return null;

  try {
    const payloadEncoded = token.split(".")[1];
    return JSON.parse(Buffer.from(payloadEncoded, "base64").toString("utf-8"));
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
}

/**
 * Get user role from auth token
 * @param token - The JWT token string or undefined
 * @returns User role or null if unavailable/invalid
 */
export function getUserRole(token?: string): string | null {
  const payload = parseToken(token);
  return payload?.roles ? payload.roles[0].toUpperCase() : null;
}

/**
 * Check if user has permission to access a specific path
 * @param path - The path to check access for
 * @param token - Optional JWT token (will use cookie if not provided)
 * @returns Boolean indicating whether user has access
 */
export function checkAccess(path: string, token?: string): boolean {
  try {
    // Use provided token or get from cookie
    const authToken = token ?? cookieHandler.getAuthToken();
    if (!authToken) return false;

    const userRole = getUserRole(authToken);
    if (!userRole) return false;

    return hasAccess(userRole, path);
  } catch (error) {
    console.error("Error checking access:", error);
    return false;
  }
}

/**
 * Check if the current user has a specific role
 * @param role - Role to check against (case insensitive)
 * @param token - Optional token (will use cookie if not provided)
 * @returns Boolean indicating if user has the specified role
 */
export function hasRole(role: string, token?: string): boolean {
  const userRole = getUserRole(token ?? cookieHandler.getAuthToken());
  return userRole === role.toUpperCase();
}

/**
 * Get array of user permissions from token
 * @param token - Optional token (will use cookie if not provided)
 * @returns Array of permission strings or empty array if no permissions
 */
export function getUserPermissions(token?: string): string[] {
  const payload = parseToken(token || cookieHandler.getAuthToken());
  return payload?.permissions || [];
}

/**
 * Check if user has a specific permission
 * @param permission - Permission to check
 * @param token - Optional token (will use cookie if not provided)
 * @returns Boolean indicating if user has the permission
 */
export function hasPermission(permission: string, token?: string): boolean {
  const permissions = getUserPermissions(token);
  return permissions.includes(permission);
}
