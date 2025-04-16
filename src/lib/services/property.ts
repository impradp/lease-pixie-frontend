"use client";

import { apiService } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { PropertyListResponse } from "@/types/Property";

class PropertyService {
  async fetchAll(): Promise<PropertyListResponse> {
    return await apiService.get<PropertyListResponse>(
      ENDPOINTS.PROPERTY.FETCH.DEFAULT
    );
  }
}

export const propertyService = new PropertyService();
