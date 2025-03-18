import { PortfolioUser } from "@/types/Portfolio";
import { DropdownOption } from "@/types/user";

//TODO: Remove this sample data later after integrating with the API
export const samplePrimaryUsers: DropdownOption[] = [
  { label: "Select user", subLabel: "", value: "" },
  { label: "John Doe", subLabel: "johndoe@email.com", value: "1" },
  { label: "Simon Cowell", subLabel: "simoncowell@email.com", value: "2" },
  { label: "Ms Roxy", subLabel: "ms.roxy@email.com", value: "3" },
  { label: "Andrew Legend", subLabel: "andrew.legend@email.com", value: "4" },
];

export const sampleSecondaryUsers: DropdownOption[] = [
  { label: "Secondary user not active", subLabel: "", value: "" },
  { label: "John Doe", subLabel: "johndoe@email.com", value: "1" },
  { label: "Simon Cowell", subLabel: "simoncowell@email.com", value: "2" },
  { label: "Ms Roxy", subLabel: "ms.roxy@email.com", value: "3" },
  { label: "Andrew Legend", subLabel: "andrew.legend@email.com", value: "4" },
];

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

export const loggedInUser = {
  name: "Jane",
  email: "janedoe@gmail.com",
};

export const samplePortfolioUser: PortfolioUser[] = [
  {
    id: "user1",
    name: "Sarah Johnson",
    email: "SarahJohnson@gmail.com",
    phone: "905.345.789",
    portfolios: [
      { id: "port1", name: "Portfolio Name A", propertyCount: 1 },
      { id: "port2", name: "Portfolio Name B", propertyCount: 2 },
    ],
  },
];
