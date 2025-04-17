"use client";

import { apiService } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";

// Define the raw response structure
interface ResetResponse {
  data: { message: string };
  status: string;
  errorDetails: {
    message: string;
    code: number;
  };
}

interface ResetRequest {
  mobileNumber: string;
  email: string;
}

interface ResetVerifyRequest {
  mobileNumber: string;
  resetCode: string;
  email: string;
}

interface ResolveConsentRequest {
  mobileNumber: string;
  email: string;
  smsConsentAccepted: boolean;
  serviceTermConsentAccepted: boolean;
  cookieConsentAccepted: boolean;
}

class AuthService {
  async reset(credentials: ResetRequest): Promise<ResetResponse> {
    return await apiService.post<ResetResponse>(
      ENDPOINTS.AUTH.RESET_LOGIN,
      credentials
    );
  }

  async resetVerify(credentials: ResetVerifyRequest): Promise<ResetResponse> {
    return await apiService.post<ResetResponse>(
      ENDPOINTS.AUTH.RESET_VERIFY,
      credentials
    );
  }

  async resolveConsent(payload: ResolveConsentRequest): Promise<ResetResponse> {
    return await apiService.post<ResetResponse>(
      ENDPOINTS.AUTH.RESOLVE_CONSENT,
      payload
    );
  }
}

export const authService = new AuthService();
