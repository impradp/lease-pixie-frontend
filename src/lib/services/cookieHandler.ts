export class CookieHandler {
  getCookie(name: string): string | undefined {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];
  }

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

  clearLoginAttempts(): void {
    this.setLoginAttempts(0, null, null, 0);
  }
}

export const cookieHandler = new CookieHandler();
