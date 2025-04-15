import toastr from "@/lib/func/toastr";
import { decodeMsg, MessageCode } from "@/lib/constants/message";

interface HandleErrorOptions {
  code: MessageCode;
  error?: unknown; // Optional original error object for logging
}

/**
 * Handles info by logging them and displaying a toast notification
 * @param options - Error handling options
 */
const handleInfo = ({ code, error }: HandleErrorOptions): void => {
  // Log the error to console (you could replace this with a more sophisticated logging service)
  const info = decodeMsg(code);

  if (info.type != "success" && info.type != "info") {
    if (error) {
      console.error(`Exception: ${info.message}`, error);
    } else {
      console.error(`Error: ${info.message}`);
    }
  }

  // Display toast notification
  toastr({
    message: `${info.message}`, // You could customize the format further if needed
    toastrType: `${info.type}`,
  });
};

export default handleInfo;
