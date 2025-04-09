"use client";

import { apiService } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { Account, AccountResponse } from "@/types/Account";

/**
 * Service class for managing account-related API operations
 */
class AccountService {
  /**
   * Creates a new account
   * @param accountPayload - The account data to create
   * @returns Promise resolving to the account creation response
   */
  async create(accountPayload: Account): Promise<AccountResponse> {
    return await apiService.post<AccountResponse>(
      ENDPOINTS.ACCOUNT.DEFAULT,
      accountPayload
    );
  }

  /**
   * Fetches account data
   * @returns Promise resolving to the account data response
   */
  async fetch(): Promise<AccountResponse> {
    return await apiService.get<AccountResponse>(ENDPOINTS.ACCOUNT.DEFAULT);
  }
}

export const accountService = new AccountService();
