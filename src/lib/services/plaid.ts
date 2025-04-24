"use client";

import { apiService } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { PlaidResponse } from "@/types/Plaid";

/**
 * Service class for managing plaid-related API operations
 */
class PlaidService {
  /**
   * Creates a new link token
   * @returns Promise resolving to the plaid link response
   */

  async generateLinkToken(): Promise<PlaidResponse> {
    return await apiService.get<PlaidResponse>(ENDPOINTS.PLAID.LINK_TOKEN);
  }
}

export const plaidService = new PlaidService();
