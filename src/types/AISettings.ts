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

export interface AISettingsV2 {
  temperature?: number | string | string;
  topP?: number | string | string;
  leaseMaxTokens?: number | string;
  leaseValuesModel: string;
  leaseValuesReasoning: string;
  leaseValuesInstruction: string;
  leasePagesModel: string;
  leasePagesReasoning: string;
  leasePagesInstruction: string;
  leaseSentencesModel: string;
  leaseSentencesReasoning: string;
  leaseSentencesInstruction: string;
  leaseSummaryModel: string;
  leaseSummaryReasoning: string;
  leaseSummaryInstruction: string;
  workflowMaxToken?: number | string;
  workflowModel: string;
  workflowInstruction: string;
  workflowTenantVectorStorageId: string;
  workflowInquiryVectorStorageId: string;
  workflowMaintenanceVectorStorageId: string;
  workflowPropertyVectorStorageId: string;
  workflowLeaseVectorStorageId: string;
  workflowAccountingVectorStorageId: string;
  workflowBillPayVectorStorageId: string;
  vendorMaxToken: number | string | null;
  vendorModel: string;
  vendorInstruction: string;
  tenantMaxToken?: number | string;
  tenantModel: string;
  tenantInstruction: string;
  bankingMaxToken?: number | string;
  bankingModel: string;
  bankingReasoning: string;
  bankingInstruction: string;
}

export interface AISettingsV2Response {
  status: string;
  message: string;
  data: AISettingsV2;
}
