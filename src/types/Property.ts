import { PropertyInfoData } from "./PropertyInfo";

export interface BankSettingsData {
  selectedBankAccount: string;
  pendingAccountApprovalFlag: boolean;
}

export interface PropertyResponse {
  status: string; // Status of the response (e.g., "SUCCESS", "ERROR")
  data: PropertyInfoData; // Array of properties
  message?: string; // Message associated with the response
}

export interface PropertyListResponse {
  status: string; // Status of the response (e.g., "SUCCESS", "ERROR")
  data: PropertyInfoData[]; // Array of properties
  message?: string; // Message associated with the response
}
