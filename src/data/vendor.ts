import { NewVendorFormData } from "@/types/vendor";

export const defaultData: NewVendorFormData = {
  companyName: "",
  serviceDescription: "",
  companyAddress: "",
  officePhoneNumber: "",
  contactFirstName: "",
  contactLastName: "",
  emailAddress: "",
  mobileNumber: "",
  requestW9: false,
  send1099: false,
  getInsuranceCert: false,
  isDeleted: false,
};
