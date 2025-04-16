"use client";

import { apiService } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import {
  DepositAccount,
  DepositAccountListResponse,
  DepositAccountResponse,
} from "@/types/DepositAccount";

/**
 * Service class for managing deposit account-related API operations
 */
class DepositAccountService {
  /**
   * Creates a new deposit account
   * @param accountPayload - The deposit account data to create
   * @returns Promise resolving to the deposit account creation response
   */
  async create(
    accountPayload: DepositAccount
  ): Promise<DepositAccountResponse> {
    return await apiService.post<DepositAccountResponse>(
      ENDPOINTS.DEPOSIT_ACCOUNT.DEFAULT,
      accountPayload
    );
  }

  /**
   * Fetches deposit account data
   * @returns Promise resolving to the deposit account data response
   */
  async fetch(): Promise<DepositAccountListResponse> {
    return await apiService.get<DepositAccountListResponse>(
      ENDPOINTS.DEPOSIT_ACCOUNT.DEFAULT
    );
  }
}

export const depositAccountService = new DepositAccountService();
