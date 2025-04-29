export interface User {
  id?: string;
  name: string;
  email: string;
  isActive?: boolean;
}

export interface UserListResponse {
  status: string;
  data: NewUserFormData[];
  message?: string;
}

export interface UserResponse {
  status: string;
  data: NewUserFormData;
  message?: string;
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
