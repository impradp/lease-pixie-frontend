"use client";

import { apiService } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import {
  DepositAccount,
  DepositAccountListResponse,
  DepositAccountPlaidSetup,
  DepositAccountResponse,
} from "@/types/DepositAccount";
import { interpolate } from "../utils/stringUtils";

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
   * Deletes the deposit account by id.
   *
   * @param accountId The unique identifier of deposit account
   * @returns The confirmation object indicating deletion of deposit account
   */
  async delete(accountId: string): Promise<DepositAccountResponse> {
    return await apiService.delete<DepositAccountResponse>(
      interpolate(ENDPOINTS.DEPOSIT_ACCOUNT.EDIT.DEFAULT, accountId)
    );
  }

  /**
   * Fetches deposit account data
   *
   * @param accountId The unique identifier of the account.
   * @returns Promise resolving to the deposit account data response
   */
  async fetch(accountId: string): Promise<DepositAccountListResponse> {
    return await apiService.get<DepositAccountListResponse>(
      interpolate(ENDPOINTS.DEPOSIT_ACCOUNT.FETCH, accountId)
    );
  }

  /**
   * Patches the single attribute update for associated deposit account data
   * @returns Promise resolving to the patch process with deposit account data response
   */
  async updatePaymentProcessing(
    id: string,
    isPaymentProcessingOn: boolean
  ): Promise<DepositAccountResponse> {
    return await apiService.patch<DepositAccountResponse>(
      interpolate(ENDPOINTS.DEPOSIT_ACCOUNT.EDIT.DEFAULT, id),
      { isPaymentProcessingOn: isPaymentProcessingOn }
    );
  }

  /**
   * Patches the single attribute update for associated deposit account data
   * @returns Promise resolving to the patch process with deposit account data response
   */
  async onboardMerchant(
    depositAccountId: string
  ): Promise<DepositAccountResponse> {
    return await apiService.patch<DepositAccountResponse>(
      interpolate(
        ENDPOINTS.DEPOSIT_ACCOUNT.EDIT.SETUP_MERCHANT,
        depositAccountId
      ),
      {}
    );
  }

  /**
   * Patches the single attribute update for associated deposit account data
   * @returns Promise resolving to the patch process with deposit account data response
   */
  async setUpPlaid(
    depositAccountId: string,
    plaidSetup: DepositAccountPlaidSetup
  ): Promise<DepositAccountResponse> {
    return await apiService.patch<DepositAccountResponse>(
      interpolate(ENDPOINTS.DEPOSIT_ACCOUNT.EDIT.SETUP_PLAID, depositAccountId),
      plaidSetup
    );
  }
}

export const depositAccountService = new DepositAccountService();
