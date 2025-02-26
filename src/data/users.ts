import { DropdownOption } from "@/types/user";

//TODO: Remove this sample data later after integrating with the API
export const samplePrimaryUsers: DropdownOption[] = [
  { label: "Select user", value: "" },
  { label: "John Doe", value: "johndoe@email.com" },
  { label: "Simon Cowell", value: "simoncowell@email.com" },
  { label: "Ms Roxy", value: "ms.roxy@email.com" },
  { label: "Andrew Legend", value: "andrew.legend@email.com" },
];

export const sampleSecondaryUsers: DropdownOption[] = [
  { label: "Secondary user not active", value: "" },
  { label: "John Doe", value: "johndoe@email.com" },
  { label: "Simon Cowell", value: "simoncowell@email.com" },
  { label: "Ms Roxy", value: "ms.roxy@email.com" },
  { label: "Andrew Legend", value: "andrew.legend@email.com" },
];

export const sampleVendorUsers: DropdownOption[] = [
  { label: "Seat not active", value: "" },
  { label: "John Doe", value: "A TLC, North Texas" },
  { label: "Simon Cowell", value: "B LLC, New York, Santa Monica" },
  { label: "Ms Roxy", value: "X Technologies, Smith Fort" },
  { label: "Andrew Legend", value: "A Technologiec, Bay Area" },
];
