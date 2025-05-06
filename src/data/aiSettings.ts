import {
  AISettings,
  BankingBaseContext,
  BaseContext,
  LeaseBaseContext,
  WorkflowBaseContext,
} from "@/types/AISettings";

const leaseBaseContext: LeaseBaseContext = {
  model: "",
  reasoning: "",
  instructions: "",
};

const workflowBaseContext: WorkflowBaseContext = {
  maxToken: "",
  model: "",
  instructions: "",
  tenantVectorStorageId: "",
  inquiryVectorStorageId: "",
  maintainenceVectorStorageId: "",
  propertyVectorStorageId: "",
  leaseVectorStorageId: "",
  accountingVectorStorageId: "",
  billPayVectorStorageId: "",
};

const bankingBaseContext: BankingBaseContext = {
  maxToken: "",
  model: "",
  reasoning: "",
  instructions: "",
};

const baseContext: BaseContext = {
  maxToken: "",
  model: "",
  instructions: "",
};
export const sampleAISettings: AISettings = {
  id: "",
  tempreature: "",
  topP: "",
  lease: {
    maxToken: "",
    values: leaseBaseContext,
    pages: leaseBaseContext,
    sentences: leaseBaseContext,
    summary: leaseBaseContext,
  },
  workflow: workflowBaseContext,
  vendor: baseContext,
  tenant: baseContext,
  banking: bankingBaseContext,
};
