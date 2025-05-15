export interface ClientPaymentProcessor {
  id?: string;
  defaultProcessorId: string;
  firstProcessor: ProcessorInfo;
  secondProcessor: ProcessorInfo;
  thirdProcessor: ProcessorInfo;
  platformProcessor: ProcessorInfo;
}

interface ProcessorInfo {
  id: string;
  uuid: string;
  email: string;
}

export interface ClientPaymentProcessorResponse {
  data: ClientPaymentProcessor;
  status: string;
  message: string;
}
