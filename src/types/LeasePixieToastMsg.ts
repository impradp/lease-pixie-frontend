export interface LeasePixieToastMsg {
  type: "error" | "success" | "info";
  message: string;
}
