"use client";

import { apiService } from "@/lib/api";
import { NewUserFormData } from "@/types/user";
import { NewVendorFormData } from "@/types/vendor";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import {
  PortfolioDto,
  PortfolioResponseDto,
  PortfolioUserListResponse,
  PortfolioUserResponse,
  PortfolioVendorListResponse,
  PortfolioVendorResponse,
} from "@/types/Portfolio";

class PortfolioService {
  async addUser(payload: NewUserFormData): Promise<PortfolioUserResponse> {
    return await apiService.post<PortfolioUserResponse>(
      ENDPOINTS.PORTFOLIO.ADD_USER,
      payload
    );
  }

  async getUsers(): Promise<PortfolioUserListResponse> {
    return await apiService.get<PortfolioUserListResponse>(
      ENDPOINTS.PORTFOLIO.GET_USERS
    );
  }

  async addVendor(
    vendorData: NewVendorFormData
  ): Promise<PortfolioVendorResponse> {
    return await apiService.post<PortfolioVendorResponse>(
      ENDPOINTS.PORTFOLIO.ADD_VENDOR,
      vendorData
    );
  }

  async getVendors(): Promise<PortfolioVendorListResponse> {
    return await apiService.get<PortfolioVendorListResponse>(
      ENDPOINTS.PORTFOLIO.GET_VENDORS
    );
  }

  async create(portfolioData: PortfolioDto): Promise<PortfolioResponseDto> {
    return await apiService.post<PortfolioResponseDto>(
      ENDPOINTS.PORTFOLIO.ADD,
      portfolioData
    );
  }
}

export const portfolioService = new PortfolioService();
