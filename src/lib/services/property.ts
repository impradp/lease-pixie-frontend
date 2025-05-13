"use client";

import { apiService } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { PropertyListResponse, PropertyResponse } from "@/types/Property";
import { interpolate } from "../utils/stringUtils";
import { PropertyInfoData } from "@/types/PropertyInfo";

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

  async create(payload: PropertyInfoData): Promise<PropertyResponse> {
    return await apiService.post<PropertyResponse>(
      ENDPOINTS.PROPERTY.FETCH.DEFAULT,
      payload
    );
  }
}

export const propertyService = new PropertyService();
