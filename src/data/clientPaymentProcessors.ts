import { ClientPaymentProcessor } from "@/types/ClientPaymentProcessor";

export const sampleClientPaymentProcessor: ClientPaymentProcessor = {
  id: undefined,
  defaultProcessorId: "",
  firstProcessorId: "",
  firstProcessorUUID: "",
  firstProcessorEmail: "",
  secondProcessorId: "",
  secondProcessorUUID: "",
  secondProcessorEmail: "",
  thirdProcessorId: "",
  thirdProcessorUUID: "",
  thirdProcessorEmail: "",
};

export const processorOptions = [
  { label: "PaidYet", value: "PaidYet" },
  { label: "Stripe", value: "Stripe" },
  { label: "Square", value: "Square" },
];
