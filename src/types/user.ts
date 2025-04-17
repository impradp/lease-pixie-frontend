export interface User {
  name: string;
  email: string;
  isActive?: boolean;
}

export interface NewUserFormData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  mobileNumber: string;
  smsActive?: boolean;
}

export interface DropdownOption {
  label: string;
  subLabel?: string;
  value: string;
}
