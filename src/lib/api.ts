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

      if (!response.ok) {
        return null;
      }

      const data: { token?: string } = await response.json();
      if (data.token) {
        this.token = data.token;
        document.cookie = `auth_token=${this.token}; path=/; max-age=${
          60 * 60 * 24 * 7
        }; ${process.env.NODE_ENV === "production" ? "secure" : ""}`;
        return this.token;
      }
      return null;
    } catch {
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
    const config: RequestInit = {
      method,
      headers,
      credentials: "include",
    };

    if (method !== "GET" && method !== "HEAD") {
      config.body = this.getRequestBody(body);
    }

    return config;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body: object | FormData,
    isRetry: boolean = false
  ): Promise<T> {
    if (!endpoint) {
      throw new Error("Endpoint is undefined or empty");
    }

    const headers = this.createHeaders(body, endpoint);
    const config = this.createRequestConfig(method, headers, body);
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, config);

      // Check if response is OK first
      if (!response.ok) {
        if (
          process.env.NEXT_REFRESH_TOKEN_ENABLE &&
          response.status === 401 &&
          !isRetry
        ) {
          const newToken = await this.refreshToken();
          if (newToken) {
            return this.request<T>(method, endpoint, body, true);
          }
        }
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      // Get content type to determine parsing method
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        // Parse as JSON for JSON content type
        const rawText = await response.text();
        try {
          return rawText ? JSON.parse(rawText) : ({} as T);
        } catch (parseError) {
          throw new Error(`Failed to parse response as JSON: ${parseError}`);
        }
      } else {
        // For text/plain responses, handle based on the generic type T
        const rawText = await response.text();
        if ((typeof {} as T) === "string") {
          return rawText as unknown as T;
        } else {
          // Try to convert text to an object that matches T
          return { message: rawText, status: response.status } as unknown as T;
        }
      }
    } catch (error) {
      throw error;
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
