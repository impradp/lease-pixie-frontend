export interface Property {
  id: string; // Optional unique identifier
  name: string; // Property name
  address: string; // Property address
}

export interface BankSettingsData {
  selectedBankAccount: string;
  pendingAccountApprovalFlag: boolean;
}

export interface PropertyListResponse {
  status: string; // Status of the response (e.g., "SUCCESS", "ERROR")
  data: Property[]; // Array of properties
  message?: string; // Message associated with the response
}
