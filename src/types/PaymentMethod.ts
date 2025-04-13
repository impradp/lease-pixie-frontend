export interface PaymentMethodFormData {
  id?: number;
  accountNumber: string;
  description: string;
  lastPaymentDate: string;
  lastPaymentAmount: string;
  autoPay: boolean;
}
