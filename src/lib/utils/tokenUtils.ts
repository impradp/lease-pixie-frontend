// Token payload interface for better type safety
interface TokenPayload {
  roles: string[];
  exp: number;
  [key: string]: string[] | number | string;
}

/**
 * Decodes and verifies JWT token
 * @param token - The JWT token string
 * @returns The decoded payload or null if invalid
 */
export function decodeToken(token: string | undefined): TokenPayload | null {
  if (!token) return null;

  try {
    const payloadEncoded = token.split(".")[1];
    if (!payloadEncoded) return null;

    const payload = JSON.parse(
      Buffer.from(payloadEncoded, "base64").toString("utf-8")
    );

    // Validate essential fields
    if (!payload.roles && !payload.roles[0]) {
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
export function isTokenValid(token: string | undefined): boolean {
  if (!token) return false;

  const payload = decodeToken(token);
  if (!payload) return false;

  const currentTimestamp = Math.floor(Date.now() / 1000);
  return Boolean(payload.exp && currentTimestamp < payload.exp);
}
