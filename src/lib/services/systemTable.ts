"use client";

import { apiService } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import {
  ClientPaymentProcessor,
  ClientPaymentProcessorResponse,
} from "@/types/ClientPaymentProcessor";

class SystemTableService {
  /**
   * Updates the payment processor information for a client.
   *
   * @param payload - The payload containing the payment processor information to be updated.
   * @returns The response from the API after updating the payment processor.
   */
  async updatePaymentProcessor(
    payload: ClientPaymentProcessor
  ): Promise<ClientPaymentProcessorResponse> {
    return await apiService.post<ClientPaymentProcessorResponse>(
      ENDPOINTS.SYSTEM_TABLE.CLIENT_PAYMENT_PROCESSOR,
      payload
    );
  }

  /**
   * Fetches the payment processor information for a client.
   *
   * @returns The response from the API containing the payment processor information.
   */
  async fetchPaymentProcessor(): Promise<ClientPaymentProcessorResponse> {
    return await apiService.get<ClientPaymentProcessorResponse>(
      ENDPOINTS.SYSTEM_TABLE.CLIENT_PAYMENT_PROCESSOR
    );
  }
}

export const systemTableService = new SystemTableService();
