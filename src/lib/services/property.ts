"use client";

import { apiService } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { PropertyListResponse } from "@/types/Property";
import { interpolate } from "../utils/stringUtils";

class PropertyService {
  async fetchAll(): Promise<PropertyListResponse> {
    return await apiService.get<PropertyListResponse>(
      ENDPOINTS.PROPERTY.FETCH.DEFAULT
    );
  }

  async fetchByAccountId(accountId: string): Promise<PropertyListResponse> {
    return await apiService.get<PropertyListResponse>(
      interpolate(ENDPOINTS.PROPERTY.FETCH.BY_ACCOUNT_ID, accountId)
    );
  }
}

export const propertyService = new PropertyService();
