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
}

export interface DropdownOption {
  label: string;
  value: string;
}
