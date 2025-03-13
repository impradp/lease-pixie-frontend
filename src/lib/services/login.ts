"use client";

import { apiService } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";

// Define the raw response structure
interface LoginResponse {
  access_token: string;
  userRole: string;
  token_type: string;
  status: number;
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
    if (response.access_token) {
      apiService.setToken(response.access_token);
    }
    return response;
  }

  logout() {
    apiService.clearToken();
  }
}

export const loginService = new LoginService();
