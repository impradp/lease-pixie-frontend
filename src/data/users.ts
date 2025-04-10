import { DropdownOption } from "@/types/user";

//TODO: Remove this sample data later after integrating with the API
export const emptyUserOption = {
  value: "",
  label: "Select user",
  subLabel: "",
};
export const emptySecondaryUserOption = {
  value: "",
  label: "Secondary user not active",
  subLabel: "",
};

export const emptyVendorOption = {
  value: "",
  label: "Seat not active",
  subLabel: "",
};

export const loggedInUser = {
  name: "Jane",
  email: "janedoe@gmail.com",
};

export const sampleVendors: DropdownOption[] = [
  { label: "Seat not active", subLabel: "", value: "" },
  { label: "John Doe", subLabel: "A TLC, North Texas", value: "1" },
  {
    label: "Simon Cowell",
    subLabel: "B LLC, New York, Santa Monica",
    value: "2",
  },
  { label: "Ms Roxy", subLabel: "X Technologies, Smith Fort", value: "3" },
  { label: "Andrew Legend", subLabel: "A Technologiec, Bay Area", value: "4" },
];
