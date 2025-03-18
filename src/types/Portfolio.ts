export interface Portfolio {
  id?: string;
  name: string; // The portfolio's name or title
  propertyCount: number; // Number of properties in the portfolio
  sqft?: number; // Total square footage
  completionPercentage?: number; // Completion percentage (0-100)
}

export interface PortfolioUser {
  id: string; // Unique identifier for the user
  name: string; // User name
  email: string; // User email
  phone: string; // User phone number
  portfolios: Portfolio[]; // List of portfolios associated with the user
}
