interface CostMargin {
  month: string | null;
  year: number | null;
  cost: string;
  margin: string;
  isHighlighted?: boolean;
}

export interface Portfolio {
  id?: string;
  name: string; // The portfolio's name or title
  completionPercentage?: number; // Completion percentage (0-100)
  category?: string;
  totalSquareFeet?: number;
  totalProperties?: number;
  squareFootage?: string;
  costMargins?: CostMargin[];
  primaryUserId?: number;
  secondaryUserId?: number;
  primaryUser?: {
    id: string | number;
  };
  secondaryUser?: {
    id?: string | number; // Optional since it uses optional chaining in the original
  };
  preferredInsuranceSeats?: {
    id?: string | number; // Optional since it uses optional chaining in the original
  };
  preferredAttorneys?: {
    id?: string | number; // Optional since it uses optional chaining in the original
  };
  preferredAccountingSeats?: {
    id?: string | number; // Optional since it uses optional chaining in the original
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
