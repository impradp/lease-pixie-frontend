export interface PlaidResponse {
  status: string;
  data: PlaidData;
  message?: string;
}

interface PlaidData {
  linkToken: string;
}

export interface PlaidErrorResponse {
  displayMessage: string;
  errorCode: number;
  errorMessage: string;
}
