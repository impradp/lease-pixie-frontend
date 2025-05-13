export type PropertyInfoData = {
  id?: number;
  portfolioId?: string;
  folderName?: string;
  propertyTitle: string;
  propertyEntityName: string;
  physicalPropertyAddress: string;
  requestedBuildingSize: string;
  requestedCategory: string;
  estimatedMonthlyCollection: string;
  largestMonthlyInvoice: string;
  propertyManagementLegalEntity: string;
  propertyManagementOfficePhoneNumber: string;
  propertyManagementemailAddress: string;
  vendorPayableRemittanceAddress: string;
  floorPlan: string;
  elvatorPlan: string;
  metadata?: ActivityMetadata;
};

export type ActivityMetadata = {
  pageId?: number; //PageID (property dash, list, unit dashboard, invoice dash)
  page: string;
  sectionName?: string; //only when updating the particular section
  itemId?: number;
  itemName?: string;
  reference?: string;
  referenceId?: number;
  devNotes?: string;
  alteredItems?: string[];
};
