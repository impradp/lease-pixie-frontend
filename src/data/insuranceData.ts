import { InsuranceSettingsData } from "@/types/InsuranceSettings";

export const sprinklerSystemOptions = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

export const firePanelsOptions = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
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

export const sampleInsuranceInfo: InsuranceSettingsData = {
  id: "",
  firePanels: "",
  sprinklerSystem: "",
  constructionYear: "",
  propertyExpirationDate: "",
  instructions: "",
  roofStructure: "",
  buildingStructure: "",
};
