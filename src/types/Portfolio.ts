export interface Portfolio {
  id?: string;
  name: string; // The portfolio's name or title
  propertyCount: number; // Number of properties in the portfolio
  sqft?: number; // Total square footage
  completionPercentage?: number; // Completion percentage (0-100)
}

// Define PortfolioUserResponse type
export interface PortfolioUserResponse {
  status: string;
  data: {
    id: number;
    email: string;
    mobileNumber: string;
    firstName: string;
    lastName: string;
  };
}

export interface PortfolioUserListResponse {
  status: string;
  data: PortfolioUserResponse["data"][];
}

export interface PortfolioVendorListResponse {
  status: string;
  data: PortfolioVendorResponse["data"][];
}

export interface PortfolioVendorResponse {
  status: string;
  data: {
    id: number;
    email: string;
    mobileNumber: string;
    companyName: string;
    companyAddress: string;
  };
}

export interface PortfolioUser {
  id: string; // Unique identifier for the user
  name: string; // User name
  email: string; // User email
  phone: string; // User phone number
  portfolios: Portfolio[]; // List of portfolios associated with the user
}

export interface PortfolioDto {
  name: string;
  primaryUser: {
    id: number;
  };
  secondaryUser: {
    id?: number; // Optional since it uses optional chaining in the original
  };
  preferredInsuranceSeats: {
    id?: number; // Optional since it uses optional chaining in the original
  };
  preferredAttorneys: {
    id?: number; // Optional since it uses optional chaining in the original
  };
  preferredAccountingSeats: {
    id?: number; // Optional since it uses optional chaining in the original
  };
}

export interface PortfolioResponseDto {
  status: string;
  data: {
    name: string;
    primaryUser: {
      id: string | number;
    };
    secondaryUser: {
      id?: string | number; // Optional since it uses optional chaining in the original
    };
    preferredInsuranceSeats: {
      id?: string | number; // Optional since it uses optional chaining in the original
    };
    preferredAttorneys: {
      id?: string | number; // Optional since it uses optional chaining in the original
    };
    preferredAccountingSeats: {
      id?: string | number; // Optional since it uses optional chaining in the original
    };
  };
}
