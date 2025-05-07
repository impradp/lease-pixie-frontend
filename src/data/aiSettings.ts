import {
  AICosts,
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

export const sampleAICosts: AICosts = {
  id: "",
  ach: "",
  gptO1: {
    input: "",
    output: "",
  },
  gptO3Mini: {
    input: "",
    output: "",
  },
  gpt4OMini: { input: "", output: "" },
  form1099: "",
  w9: "",
  customForm: "",
  plaid: {
    auth: "",
    balance: "",
    monthlyTransactions: "",
  },
};

export const reasoningOptions = [
  { label: "N/A", value: "" },
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];
