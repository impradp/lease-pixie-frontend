export interface Invoice {
  date: string;
  amount: string;
  status: string;
}

export interface CostMargin {
  date: string;
  cost: string;
  margin: string;
  isHighlighted?: boolean;
}

export interface Portfolio {
  name: string;
  propertyId: string;
  propertyCount: number;
  squareFootage: string;
  costMargins: CostMargin[];
}

export interface CompanyInfoData {
  companyName: string;
  contactName: string;
  email: string;
  services: string[]; // Updated to string[] for raw backend data
  actions: string[];
  isAccessLocked: boolean;
  invoices: Invoice[];
  portfolios: Portfolio[];
}
