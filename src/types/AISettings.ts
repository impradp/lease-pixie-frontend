export interface LeaseBaseContext {
  model: string;
  reasoning: string;
  instructions: string;
}

export interface WorkflowBaseContext {
  maxToken: string;
  model: string;
  instructions: string;
  tenantVectorStorageId: string;
  inquiryVectorStorageId: string;
  maintainenceVectorStorageId: string;
  propertyVectorStorageId: string;
  leaseVectorStorageId: string;
  accountingVectorStorageId: string;
  billPayVectorStorageId: string;
}

export interface BankingBaseContext {
  maxToken: string;
  model: string;
  reasoning: string;
  instructions: string;
}

export interface BaseContext {
  maxToken: string;
  model: string;
  instructions: string;
}

export interface AISettings {
  id?: string;
  tempreature: string;
  topP: string;
  lease: {
    maxToken: string;
    values: LeaseBaseContext;
    pages: LeaseBaseContext;
    sentences: LeaseBaseContext;
    summary: LeaseBaseContext;
  };
  workflow: WorkflowBaseContext;
  vendor: BaseContext;
  tenant: BaseContext;
  banking: BankingBaseContext;
}

interface AIModelContext {
  input: string;
  output: string;
}

interface PlaidContext {
  auth: string;
  balance: string;
  monthlyTransactions: string;
}

export interface AICosts {
  id?: string;
  ach: string;
  gptO1: AIModelContext;
  gptO3Mini: AIModelContext;
  gpt4OMini: AIModelContext;
  form1099: string;
  w9: string;
  customForm: string;
  plaid: PlaidContext;
}
