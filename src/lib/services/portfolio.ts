"use client";

import { apiService } from "@/lib/api";
import { NewUserFormData } from "@/types/user";
import { NewVendorFormData } from "@/types/vendor";
import { ENDPOINTS } from "@/lib/constants/endpoints";
import { interpolate } from "@/lib/utils/stringUtils";
import {
  Portfolio,
  PortfolioListResponse,
  PortfolioResponse,
  PortfolioUserResponse,
  PortfolioVendorListResponse,
  PortfolioVendorResponse,
} from "@/types/Portfolio";

/**
 * Service class for managing portfolio-related operations
 * @class PortfolioService
 */
class PortfolioService {
  /**
   * Adds a new user to a portfolio
   * @param {NewUserFormData} payload - The user data to add
   * @returns {Promise<PortfolioUserResponse>} The response containing the added user details
   */
  async addUser(payload: NewUserFormData): Promise<PortfolioUserResponse> {
    // Send POST request to add user endpoint with provided payload
    return await apiService.post<PortfolioUserResponse>(
      ENDPOINTS.PORTFOLIO.ADD.USER,
      payload
    );
  }

  /**
   * Deletes a user from a portfolio by ID
   * @param {number} id - The ID of the user to delete
   * @returns {Promise<PortfolioUserResponse>} The response confirming user deletion
   */
  async deleteUser(id: number): Promise<PortfolioUserResponse> {
    // Interpolate user ID into delete endpoint URL
    const endpoint = interpolate(ENDPOINTS.PORTFOLIO.DELETE.USER, id);
    // Send DELETE request to remove user
    return await apiService.delete<PortfolioUserResponse>(endpoint);
  }

  /**
   * Adds a new vendor to a portfolio
   * @param {NewVendorFormData} vendorData - The vendor data to add
   * @returns {Promise<PortfolioVendorResponse>} The response containing the added vendor details
   */
  async addVendor(
    vendorData: NewVendorFormData
  ): Promise<PortfolioVendorResponse> {
    // Send POST request to add vendor endpoint with provided vendor data
    return await apiService.post<PortfolioVendorResponse>(
      ENDPOINTS.PORTFOLIO.ADD.VENDOR,
      vendorData
    );
  }

  /**
   * Fetches the list of vendors associated with a portfolio
   * @returns {Promise<PortfolioVendorListResponse>} The response containing the list of vendors
   */
  async getVendors(): Promise<PortfolioVendorListResponse> {
    // Send GET request to fetch vendors endpoint
    return await apiService.get<PortfolioVendorListResponse>(
      ENDPOINTS.PORTFOLIO.FETCH.VENDORS
    );
  }

  /**
   * Creates a new portfolio
   * @param {Portfolio} portfolioData - The portfolio data to create
   * @returns {Promise<PortfolioResponse>} The response containing the created portfolio details
   */
  async create(portfolioData: Portfolio): Promise<PortfolioResponse> {
    // Send POST request to create portfolio endpoint with provided data
    return await apiService.post<PortfolioResponse>(
      ENDPOINTS.PORTFOLIO.ADD.DEFAULT,
      portfolioData
    );
  }

  /**
   * Updates an existing portfolio
   * @param {number} portfolioId - The ID of the portfolio to update
   * @param {Portfolio} portfolioData - The updated portfolio data
   * @returns {Promise<PortfolioResponse>} The response containing the updated portfolio details
   */
  async update(
    portfolioId: number,
    portfolioData: Portfolio
  ): Promise<PortfolioResponse> {
    // Interpolate portfolio ID into update endpoint URL
    const endpoint = interpolate(
      ENDPOINTS.PORTFOLIO.UPDATE.DEFAULT,
      portfolioId
    );
    // Send PUT request to update portfolio with provided data
    return await apiService.put<PortfolioResponse>(endpoint, portfolioData);
  }

  /**
   * Fetches all portfolios
   * @returns {Promise<PortfolioListResponse>} The response containing the list of portfolios
   */
  async fetchAll(): Promise<PortfolioListResponse> {
    // Send GET request to fetch all portfolios endpoint
    return await apiService.get<PortfolioListResponse>(
      ENDPOINTS.PORTFOLIO.FETCH.DEFAULT
    );
  }

  /**
   * Fetches portfolios by account ID
   * @param {string} accountId - The account ID to filter portfolios
   * @returns {Promise<PortfolioListResponse>} The response containing the list of portfolios
   */
  async fetchByAccountId(accountId: string): Promise<PortfolioListResponse> {
    // Interpolate account ID into fetch by account ID endpoint URL
    const endpoint = interpolate(
      ENDPOINTS.PORTFOLIO.FETCH.BY_ACCOUNT_ID,
      accountId
    );
    // Send GET request to fetch portfolios for the account
    return await apiService.get<PortfolioListResponse>(endpoint);
  }

  /**
   * Fetches a portfolio by its ID
   * @param {string} portfolioId - The ID of the portfolio to fetch
   * @returns {Promise<PortfolioResponse>} The response containing the portfolio details
   */
  async fetchById(portfolioId: string): Promise<PortfolioResponse> {
    // Interpolate portfolio ID into fetch by ID endpoint URL
    const endpoint = interpolate(ENDPOINTS.PORTFOLIO.FETCH.BY_ID, portfolioId);
    // Send GET request to fetch portfolio details
    return await apiService.get<PortfolioResponse>(endpoint);
  }
}

/**
 * Singleton instance of PortfolioService
 */
export const portfolioService = new PortfolioService();
