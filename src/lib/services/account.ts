"use client";

import { apiService } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import {
  Account,
  AccountDetailResponse,
  AccountResponse,
} from "@/types/Account";
import { interpolate } from "../utils/stringUtils";

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
   * Updates an existing account
   * @param accountId - The id of the account user
   * @param accountPayload - The account data to update
   * @returns Promise resolving to the account update response
   */
  async update(
    accountId: string,
    accountPayload: Account
  ): Promise<AccountResponse> {
    return await apiService.put<AccountResponse>(
      interpolate(ENDPOINTS.ACCOUNT.EDIT.DEFAULT, accountId),
      accountPayload
    );
  }

  async updateAccess(
    accountId: string,
    isLocked: boolean
  ): Promise<AccountResponse> {
    return await apiService.patch<AccountResponse>(
      interpolate(ENDPOINTS.ACCOUNT.EDIT.ACCESS, accountId),
      { isLocked: isLocked }
    );
  }

  /**
   * Fetches account data
   * @returns Promise resolving to the account data response
   */
  async fetch(): Promise<AccountResponse> {
    return await apiService.get<AccountResponse>(ENDPOINTS.ACCOUNT.DEFAULT);
  }

  /**
   * Fetches account data by associated account id
   * @returns Promise resolving to the account data response
   */
  async fetchById(id: number): Promise<AccountDetailResponse> {
    return await apiService.get<AccountDetailResponse>(
      interpolate(ENDPOINTS.ACCOUNT.FETCH.BY_ID, id)
    );
  }
}

export const accountService = new AccountService();
