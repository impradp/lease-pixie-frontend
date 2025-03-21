"use client";

import { apiService } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";

interface UserResponse {
  id: number;
  loginId: string;
  role: string;
}

class UserService {
  async self(): Promise<UserResponse> {
    const endpoint = ENDPOINTS.USER.SELF ?? "/api/user/self";
    const response = await apiService.get<UserResponse>(endpoint);
    return response;
  }
}

export const userService = new UserService();
