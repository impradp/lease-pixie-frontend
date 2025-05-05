"use client";

import { apiService } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import {
  ReadOnlyAdminUser,
  ReadOnlyAdminUserResponse,
  ReadOnlyAdminUsersResponse,
} from "@/types/ReadOnlyAdminUser";
import { interpolate } from "../utils/stringUtils";
import { TotpRequest, TotpResponse } from "@/types/user";

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

  async createROAdminUser(
    userData: ReadOnlyAdminUser
  ): Promise<ReadOnlyAdminUserResponse> {
    return await apiService.post<ReadOnlyAdminUserResponse>(
      ENDPOINTS.USER.ADMIN.DEFAULT,
      userData
    );
  }

  async verifyTOTP(request: TotpRequest): Promise<TotpResponse> {
    return await apiService.post<TotpResponse>(
      ENDPOINTS.USER.VERIFY.TOTP,
      request
    );
  }

  async deleteROAdminUser(
    id: number | string
  ): Promise<ReadOnlyAdminUserResponse> {
    return await apiService.delete<ReadOnlyAdminUserResponse>(
      interpolate(ENDPOINTS.USER.ADMIN.DELETE, id)
    );
  }

  async fetchROAdminUsers(): Promise<ReadOnlyAdminUsersResponse> {
    return await apiService.get<ReadOnlyAdminUsersResponse>(
      ENDPOINTS.USER.ADMIN.DEFAULT
    );
  }
}

export const userService = new UserService();
