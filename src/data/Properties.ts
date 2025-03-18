import { Property } from "@/types/Property";

export const sampleProperties: Property[] = [
  {
    id: "prop1",
    name: "Waterfront Village",
    address: "1452 Banksville Road, Pittsburgh, PA",
  },
  {
    id: "prop2",
    name: "Skyline Towers",
    address: "789 Pine Street, Seattle, WA",
  },
];

export const portfolioOptions = [
  {
    label: "Portfolio 1",
    value: "Portfolio 1",
  },
  {
    label: "Portfolio 2",
    value: "Portfolio 2",
  },
  {
    label: "Portfolio 3",
    value: "Portfolio 3",
  },
];

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

export const buildingStructureOptions = [
  { label: "Block", value: "Block" },
  { label: "Brick", value: "Brick" },
  { label: "Concrete", value: "Concrete" },
  { label: "Steel", value: "Steel" },
  { label: "Wood", value: "Wood" },
];

export const roofStructureOptions = [
  { label: "Asphalt", value: "Asphalt" },
  { label: "Concrete", value: "Concrete" },
  { label: "Metal", value: "Metal" },
  { label: "Rubber", value: "Rubber" },
  { label: "Shingle", value: "Shingle" },
];

export const sprinklerSystemOptions = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

export const firePanelsOptions = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
];

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
  payableRemittanceAddress: "",
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
  defaultNoticeBody:
    "This letter confirms a monetary default under your lease.  The details of the outstanding invoices are below, please address these payments immediately.  Further communications will be conducted by our attorney, after which point, incurred attorney costs related to this default shall be added to any amounts due.",
  w9CompletedFile: "",
};
