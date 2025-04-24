export interface DepositAccount {
  id?: string;
  accountHolderName: string;
  description: string;
  expMonthlyTotalInvoice: string;
  reqMaxSingleACHTxnLimit: string;
  lastFourDigits: string;
  plaidAccountNumber: string;
  issProcessor: string;
  issProcessorId: string;
  issMaxSingleACHTxnLimit: string;
  issMerchantAccountNumber: string;
  consentChecked: boolean;
  isPaymentProcessingOn: boolean;
  plaidLink: string;
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

export interface DepositAccountPlaidSetup {
  hasPlaidLink: boolean;
  publicToken: string;
}
