import { DepositAccount } from "@/types/DepositAccount";

export const defaultData: DepositAccount = {
  accountHolderName: "",
  description: "",
  expMonthlyTotalInvoice: "",
  reqMaxSingleACHTxnLimit: "",
  lastFourDigits: "",
  issProcessor: "",
  issProcessorId: "",
  issMaxSingleACHTxnLimit: "",
  issMerchantAccountNumber: "",
  consentChecked: false,
};

export const sampleData: DepositAccount[] = [
  {
    accountHolderName: "John Doe",
    description: "",
    expMonthlyTotalInvoice: "",
    reqMaxSingleACHTxnLimit: "200,000",
    lastFourDigits: "4526",
    issProcessor: "",
    issProcessorId: "",
    issMaxSingleACHTxnLimit: "80,000",
    issMerchantAccountNumber: "",
    consentChecked: false,
  },
];
