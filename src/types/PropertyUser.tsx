export interface SubAccessLevel {
  id: string;
  accessAvailable: string[];
}

export interface AccessLevel {
  id: string;
  propertyId: string;
  subLevels: SubAccessLevel[];
}

export interface PropertyUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  accessLevels: AccessLevel[];
}
