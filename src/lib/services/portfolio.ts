"use client";

import { apiService } from "@/lib/api";
import { NewUserFormData } from "@/types/user";
import { NewVendorFormData } from "@/types/vendor";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { interpolate } from "@/lib/utils/stringUtils";
import {
  Portfolio,
  PortfolioResponse,
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

  async getUsers(
    options: { attachPortfolio?: boolean } = { attachPortfolio: false }
  ): Promise<PortfolioUserListResponse> {
    const { attachPortfolio } = options;
    return await apiService.get<PortfolioUserListResponse>(
      interpolate(ENDPOINTS.PORTFOLIO.GET_USERS, attachPortfolio ?? false)
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

  async create(portfolioData: Portfolio): Promise<PortfolioResponse> {
    return await apiService.post<PortfolioResponse>(
      ENDPOINTS.PORTFOLIO.ADD,
      portfolioData
    );
  }
}

export const portfolioService = new PortfolioService();
