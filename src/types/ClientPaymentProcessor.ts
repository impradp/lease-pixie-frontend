export interface ClientPaymentProcessor {
  id?: string;
  defaultProcessorId: string;
  firstProcessorId: string;
  firstProcessorUUID: string;
  firstProcessorEmail: string;
  secondProcessorId: string;
  secondProcessorUUID: string;
  secondProcessorEmail: string;
  thirdProcessorId: string;
  thirdProcessorUUID: string;
  thirdProcessorEmail: string;
}
