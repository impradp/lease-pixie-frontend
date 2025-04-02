"use client";

import { apiService } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";

// Define the raw response structure
interface LoginResponse {
  data: {
    accessToken: string;
    tokenType: string;
    role: string;
    refreshToken: string;
  };
  status: string;
  errorDetails: {
    message: string;
    code: number;
  };
}

interface LoginRequest {
  loginId: string;
  totpSecret: string;
  email: string;
}

class LoginService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    if (response?.status === "SUCCESS") {
      apiService.setToken(response.data?.accessToken);
    }
    return response;
  }

  logout() {
    apiService.clearToken();
  }
}

export const loginService = new LoginService();
