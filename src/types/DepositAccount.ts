export interface DepositAccount {
  id?: string;
  accountHolderName: string;
  description: string;
  expMonthlyTotalInvoice: string;
  reqMaxSingleACHTxnLimit: string;
  lastFourDigits: string;
  issProcessor: string;
  issProcessorId: string;
  issMaxSingleACHTxnLimit: string;
  issMerchantAccountNumber: string;
  consentChecked: boolean;
}

export interface DepositAccountResponse {
  status: string;
  data: DepositAccount;
  message?: string;
}

export interface DepositAccountListResponse {
  status: string;
  data: DepositAccount[];
  message?: string;
}
