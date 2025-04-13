export class CookieHandler {
  // Generic method to get a cookie by name
  getCookie(name: string): string | undefined {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];
  }

  // Get the auth_token cookie
  getAuthToken(): string | undefined {
    return this.getCookie("auth_token");
  }

  // Clear the auth_token cookie
  clearAuthToken(): void {
    document.cookie = "auth_token=; path=/; max-age=0";
  }

  // Get login attempts data
  getLoginAttempts(): {
    attempts: number;
    lastSuccessfulLogin: string | null;
    lastFailedAttempt: string | null;
  } {
    const cookieData = this.getCookie("login_attempts");
    return cookieData
      ? JSON.parse(cookieData)
      : { attempts: 0, lastSuccessfulLogin: null, lastFailedAttempt: null };
  }

  // Set login attempts data
  setLoginAttempts(
    attempts: number,
    lastSuccessfulLogin: string | null,
    lastFailedAttempt: string | null,
    maxAge: number = 1800 // Default 30 minutes
  ): void {
    const cookieData = {
      attempts,
      lastSuccessfulLogin,
      lastFailedAttempt,
    };
    document.cookie = `login_attempts=${JSON.stringify(
      cookieData
    )}; path=/; max-age=${maxAge}; ${
      process.env.NODE_ENV === "production" ? "secure" : ""
    }`;
  }

  // Clear login attempts data
  clearLoginAttempts(): void {
    this.setLoginAttempts(0, null, null, 0);
  }
}

export const cookieHandler = new CookieHandler();
