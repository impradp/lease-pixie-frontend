export interface User {
  name: string;
  email: string;
  isActive?: boolean;
}

export interface NewUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  smsActive?: boolean;
}

export interface DropdownOption {
  label: string;
  subLabel?: string;
  value: string;
}
