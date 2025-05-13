import { PropertyInfoData } from "@/types/PropertyInfo";

export const categoryOptions = [
  {
    label: "Category 1",
    value: "Category 1",
  },
  {
    label: "Category 2",
    value: "Category 2",
  },
  {
    label: "Category 3",
    value: "Category 3",
  },
];

export const largestMonthlyInvoiceOptions = [
  { label: "$1000", value: "$1000" },
  { label: "$2000", value: "$2000" },
  { label: "$3000", value: "$3000" },
];

export const floorPlanOptions = [
  { label: "Floor Plan 1", value: "Floor Plan 1" },
  { label: "Floor Plan 2", value: "Floor Plan 2" },
  { label: "Floor Plan 3", value: "Floor Plan 3" },
];

export const elevatorPlanOptions = [
  { label: "Elevator Plan 1", value: "Elevator Plan 1" },
  { label: "Elevator Plan 2", value: "Elevator Plan 2" },
  { label: "Elevator Plan 3", value: "Elevator Plan 3" },
];

export const defaultPropertyInfo: PropertyInfoData = {
  propertyTitle: "",
  propertyEntityName: "",
  physicalPropertyAddress: "",
  estimatedMonthlyCollection: "",
  largestMonthlyInvoice: "",
  requestedBuildingSize: "",
  requestedCategory: "",
  propertyManagementLegalEntity: "",
  propertyManagementOfficePhoneNumber: "",
  propertyManagementemailAddress: "",
  vendorPayableRemittanceAddress: "",
  floorPlan: "",
  elvatorPlan: "",
};

export const existingPropertyInfoData = {
  portfolioName: "Portfolio 1",
  propertyTitle: "Property 1",
  propertyEntityName: "Property 1",
  physicalPropertyAddress: "",
  requestedBuildingSize: "",
  requestedCategory: "",
  estimatedMonthlyCollection: "",
  largestMonthlyInvoice: "",
  propertyManagementLegalEntity: "",
  propertyManagementOfficePhoneNumber: "",
  propertyManagementemailAddress: "",
  vendorPayableRemittanceAddress: "",
  floorPlan: "",
  elvatorPlan: "",
  buildingStructure: "",
  roofStructure: "",
  constructionYear: "",
  propertyExpirationDate: "",
  firePanels: "",
  sprinklerSystem: "",
};

export const existingInvoiceSettingsData = {
  entityForInvoiceHeader: "Invoice Header 1",
  addressForInvoiceHeader: "",
  phoneForInvoiceHeader: "",
  taxRateBaseRentFlag: false,
  taxRateBaseRent: "",
  estimatedTotalMonthlyCollections: "",
  largestSingleMonthlyInvoice: "",
  defaultNoticeBody:
    "This letter confirms a monetary default under your lease.  The details of the outstanding invoices are below, please address these payments immediately.  Further communications will be conducted by our attorney, after which point, incurred attorney costs related to this default shall be added to any amounts due.",
  w9CompletedFile: "",
};
