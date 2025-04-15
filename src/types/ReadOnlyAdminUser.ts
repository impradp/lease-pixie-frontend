export interface ReadOnlyAdminUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  smsActive: boolean;
}

export interface ReadOnlyAdminUserResponse {
  status: string;
  data: ReadOnlyAdminUser;
  message?: string;
}

export interface ReadOnlyAdminUsersResponse {
  status: string;
  data: ReadOnlyAdminUser[];
  message?: string;
}
