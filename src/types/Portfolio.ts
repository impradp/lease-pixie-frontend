interface CostMargin {
  month: string | null;
  year: number | null;
  cost: string;
  margin: string;
  isHighlighted?: boolean;
}

export interface Portfolio {
  id?: number;
  code?: string;
  name: string; // The portfolio's name or title
  completionPercentage?: number; // Completion percentage (0-100)
  category?: string;
  totalSquareFeet?: number;
  totalProperties?: number;
  squareFootage?: string;
  costMargins?: CostMargin[];
  primaryUserId?: number;
  secondaryUserId?: number;
  insuranceSeatVendorId?: number;
  attorneySeatVendorId?: number;
  taxReportingSeatVendorId?: number;
  primaryUser?: {
    id: string | number;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  secondaryUser?: {
    id?: string | number; // Optional since it uses optional chaining in the original
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  preferredInsuranceSeats?: {
    id?: string | number; // Optional since it uses optional chaining in the original
    companyName?: string;
    companyAddress?: string;
  };
  preferredAttorneys?: {
    id?: string | number; // Optional since it uses optional chaining in the original
    companyName?: string;
    companyAddress?: string;
  };
  preferredAccountingSeats?: {
    id?: string | number; // Optional since it uses optional chaining in the original
    companyName?: string;
    companyAddress?: string;
  };
}

export interface PortfolioUser {
  id?: number;
  email: string;
  mobileNumber?: string;
  firstName: string;
  lastName: string;
  role?: string;
  portfolioList?: Portfolio[];
}

export interface PortfolioVendor {
  id?: number;
  email: string;
  mobileNumber: string;
  companyName: string;
  companyAddress: string;
  PortfolioList?: Portfolio[];
}

// Define PortfolioUserResponse type
export interface PortfolioUserResponse {
  status: string;
  data: PortfolioUser;
}

export interface PortfolioUserListResponse {
  status: string;
  data: PortfolioUser[];
}

export interface PortfolioVendorResponse {
  status: string;
  data: PortfolioVendor;
}

export interface PortfolioVendorListResponse {
  status: string;
  data: PortfolioVendor[];
}

export interface PortfolioResponse {
  status: string;
  data: Portfolio;
  message?: string;
}

export interface PortfolioListResponse {
  status: string;
  data: Portfolio[];
  message?: string;
}
