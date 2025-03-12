"use client";

import { apiService } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";

interface UserResponse {
  id: number;
  loginId: string;
}

class UserService {
  async self(): Promise<UserResponse> {
    const response = await apiService.get<UserResponse>(ENDPOINTS.USER.SELF);
    return response;
  }
}

export const userService = new UserService();
