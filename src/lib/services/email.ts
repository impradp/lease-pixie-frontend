"use client";

import { apiService } from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants/endpoints";

// Define the raw response structure
interface LoginResetEmailResponse {
  data: {
    message: string;
  };
  status: string;
  errorDetails: {
    message: string;
    code: number;
  };
}

interface LoginResetEmailRequest {
  mobileNumber: string;
  email: string;
}

class EmailService {
  async resetLogin(
    credentials: LoginResetEmailRequest
  ): Promise<LoginResetEmailResponse> {
    return await apiService.post<LoginResetEmailResponse>(
      ENDPOINTS.AUTH.RESET_LOGIN,
      credentials
    );
  }
}

export const emailService = new EmailService();
