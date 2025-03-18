export interface PropertyApproval {
  address: string;
  portfolioId: string;
  propertyId: string;
  requestedSqFt: string;
  requestedCategory: string;
  largestInvoiceAmount: string;
  estimatedMonthlyCollection: string;
  balanceRequirement: string;
  confirmedSqFt: string;
  isIndustrialCategory: boolean;
  spaceFile: File | null; // Added to store the uploaded file
}
