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
  portfolioList: Portfolio[] | null;
  services: string[] | null; // Updated to string[] for raw backend data
  actions: string[] | null;
  isAccessLocked: boolean;
  invoices: Invoice[] | null;
}

export interface Portfolio {
  id: string;
  name: string;
  category: string | null;
  totalSquareFeet: number | null;
  totalProperties: number | null;
  squareFootage: string;
  costMargins: CostMargin[] | null;
}

export interface Invoice {
  date: string;
  amount: string;
  status: string;
}

export interface CostMargin {
  month: string | null;
  year: number | null;
  cost: string;
  margin: string;
  isHighlighted?: boolean;
}
