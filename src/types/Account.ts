import { Portfolio } from "./Portfolio";

export interface AccountResponse {
  status: string;
  data: Account[];
  message?: string;
}

export interface Account {
  id?: number;
  companyName: string;
  address: string;
  contactFirstName: string;
  contactLastName: string;
  email: string;
  mobileNumber: string;
  officePhoneNumber: string;
  portfolioList?: Portfolio[];
  services?: string[]; // Updated to string[] for raw backend data
  actions?: string[];
  isAccessLocked: boolean;
  invoices?: Invoice[];
}

export interface Invoice {
  date: string;
  amount: string;
  status: string;
}
