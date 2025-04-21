import { Portfolio } from "./Portfolio";

export interface NewVendorFormData {
  id?: number;
  companyName: string;
  serviceDescription: string;
  companyAddress: string;
  officePhoneNumber: string;
  contactFirstName: string;
  contactLastName: string;
  emailAddress: string;
  mobileNumber: string;
  requestW9: boolean;
  send1099: boolean;
  getInsuranceCert: boolean;
  portfolios?: Portfolio[]; // Optional property for portfolios
}
