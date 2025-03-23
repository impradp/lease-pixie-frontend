"use client";

import { apiService } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { Account } from "@/types/Account";

// Define the raw response structure
interface AccountResponse {
  status?: number;
  message?: string;
  data?: string;
}

class AccountService {
  async create(accountPayload: Account): Promise<AccountResponse> {
    const response = await apiService.post<AccountResponse>(
      ENDPOINTS.ACCOUNT.CREATE,
      accountPayload
    );

    if (typeof response === "string") {
      return { message: response };
    }
    return response;
  }
}

export const accountService = new AccountService();
