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
