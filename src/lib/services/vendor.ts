import { NewVendorFormData } from "@/types/vendor";
import { apiService } from "../api";
import { ENDPOINTS } from "../constants/endpoints";
import { interpolate } from "../utils/stringUtils";

interface VendorResponse {
  status: string;
  message?: string;
  data: NewVendorFormData;
}

interface VendorListResponse {
  status: string;
  message?: string;
  data: NewVendorFormData[];
}

class VendorService {
  async delete(id: string | number): Promise<VendorResponse> {
    return await apiService.delete<VendorResponse>(
      interpolate(ENDPOINTS.VENDOR.DELETE.DEFAULT, id)
    );
  }

  async restore(id: string | number): Promise<VendorResponse> {
    return await apiService.patch<VendorResponse>(
      interpolate(ENDPOINTS.VENDOR.RESTORE.DEFAULT, id),
      {}
    );
  }

  async fetchAll(): Promise<VendorListResponse> {
    return await apiService.get<VendorListResponse>(ENDPOINTS.VENDOR.DEFAULT);
  }

  async create(payload: NewVendorFormData): Promise<VendorResponse> {
    return await apiService.post<VendorResponse>(
      ENDPOINTS.VENDOR.DEFAULT,
      payload
    );
  }

  async update(
    id: string | number,
    payload: NewVendorFormData
  ): Promise<VendorResponse> {
    return await apiService.put<VendorResponse>(
      interpolate(ENDPOINTS.VENDOR.UPDATE.DEFAULT, id),
      payload
    );
  }
}

export const vendorService = new VendorService();
