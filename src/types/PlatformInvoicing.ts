export interface PlatformInvoicing {
  id?: string;
  billerId: string;
  entity: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  officePhone: string;
  email: string;
  retailBase: string;
  industrialBase: string;
}

export interface PlatformInvoicingResponse {
  status: string;
  message: string;
  data: PlatformInvoicing;
}
