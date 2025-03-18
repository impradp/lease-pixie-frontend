"use client";

export class ApiService {
  private readonly baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });
      const data: { token?: string } = await response.json();
      if (data.token) {
        this.token = data.token;
        return this.token;
      }
      return null;
    } catch {
      //TODO: Handle error properly
      return null;
    }
  }

  private getAuthToken(): string | undefined {
    return (
      this.token ??
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1]
    );
  }

  private createHeaders(
    body: object | FormData,
    endpoint: string
  ): Record<string, string> {
    const headers: Record<string, string> = {};
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const token = this.getAuthToken();
    if (
      token &&
      !endpoint.includes("/auth/login") &&
      !endpoint.includes("/auth/refresh-token")
    ) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  private getRequestBody(body?: unknown): string | FormData | undefined {
    if (body instanceof FormData) {
      return body;
    }
    if (body) {
      return JSON.stringify(body);
    }
    return undefined;
  }

  private createRequestConfig(
    method: string,
    headers: Record<string, string>,
    body?: object | FormData
  ): RequestInit {
    return {
      method,
      headers,
      credentials: "include",
      body: this.getRequestBody(body),
    };
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body: object | FormData,
    isRetry: boolean = false
  ): Promise<T> {
    const headers = this.createHeaders(body, endpoint);
    const config = this.createRequestConfig(method, headers, body);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const rawText = await response.text();

      // Ensure the response can be parsed as JSON and matches type T
      let data: T;
      try {
        data = rawText ? JSON.parse(rawText) : ({} as T);
      } catch (parseError) {
        throw new Error(`Failed to parse response as JSON: ${parseError}`);
      }

      if (!response.ok && process.env.NEXT_REFRESH_TOKEN_ENABLE) {
        if (response.status === 401 && !isRetry) {
          const newToken = await this.refreshToken();
          if (newToken) {
            return this.request<T>(method, endpoint, body, true);
          }
        }
        throw new Error(`Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      //TODO: Handle error properly
      throw error; // Let caller handle errors
    }
  }

  setToken(token: string): void {
    this.token = token;
    document.cookie = `auth_token=${token}; path=/; max-age=${
      60 * 60 * 24 * 7
    }; ${process.env.NODE_ENV === "production" ? "secure" : ""}`;
  }

  clearToken(): void {
    this.token = null;
    document.cookie = "auth_token=; path=/; max-age=0";
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>("GET", endpoint, {});
  }

  post<T>(endpoint: string, body: object | FormData): Promise<T> {
    return this.request<T>("POST", endpoint, body);
  }

  put<T>(endpoint: string, body: object | FormData): Promise<T> {
    return this.request<T>("PUT", endpoint, body);
  }

  patch<T>(endpoint: string, body: object | FormData): Promise<T> {
    return this.request<T>("PATCH", endpoint, body);
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>("DELETE", endpoint, {});
  }
}

export const apiService = new ApiService();
