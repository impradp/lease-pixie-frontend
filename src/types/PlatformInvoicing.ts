export interface PlatformInvoicing {
  id?: string;
  paymentProcessorUUID: string;
  billingId: string;
  entity: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  officePhone: string;
  emailAddress: string;
  retailBase: string;
  industrialBase: string;
}
