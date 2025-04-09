export interface Property {
  id: string; // Optional unique identifier
  name: string; // Property name
  address: string; // Property address
}

export interface BankSettingsData {
  selectedBankAccount: string;
  pendingAccountApprovalFlag: boolean;
}
