"use client";

import { apiService } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { AISettingsV2, AISettingsV2Response } from "@/types/AISettings";
import {
  ClientPaymentProcessor,
  ClientPaymentProcessorResponse,
} from "@/types/ClientPaymentProcessor";
import {
  PlatformInvoicing,
  PlatformInvoicingResponse,
} from "@/types/PlatformInvoicing";

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

  /**
   * Updates the platform invoicing information.
   *
   * @param payload - The payload containing the platform invoicing information to be updated.
   * @returns The response from the API after updating the platform invoicing.
   */
  async updatePlatformInvoicing(
    payload: PlatformInvoicing
  ): Promise<PlatformInvoicingResponse> {
    return await apiService.post<PlatformInvoicingResponse>(
      ENDPOINTS.SYSTEM_TABLE.PLATFORM_INVOICING,
      payload
    );
  }

  /**
   * Fetches the platform invoicing information.
   *
   * @returns The response from the API containing the platform invoicing information.
   */
  async fetchPlatformInvoicing(): Promise<PlatformInvoicingResponse> {
    return await apiService.get<PlatformInvoicingResponse>(
      ENDPOINTS.SYSTEM_TABLE.PLATFORM_INVOICING
    );
  }

  /**
   * Updates the AI settings.
   *
   * @param payload - The payload containing the AI settings to be updated.
   * @returns The response from the API after updating the AI settings.
   */
  async updateAISettings(payload: AISettingsV2): Promise<AISettingsV2Response> {
    return await apiService.post<AISettingsV2Response>(
      ENDPOINTS.SYSTEM_TABLE.AI_SETTINGS,
      payload
    );
  }

  /**
   * Fetches the AI settings.
   *
   * @returns The response from the API containing the AI settings.
   */
  async fetchAISettings(): Promise<AISettingsV2Response> {
    return await apiService.get<AISettingsV2Response>(
      ENDPOINTS.SYSTEM_TABLE.AI_SETTINGS
    );
  }
}

export const systemTableService = new SystemTableService();
