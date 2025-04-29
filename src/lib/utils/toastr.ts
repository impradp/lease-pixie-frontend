import { ReadonlyURLSearchParams } from "next/navigation";

import toastr from "@/lib/func/toastr";
import { decodeMsg, MessageCode } from "@/lib/constants/message";

// Set to track shown toast messages to prevent duplicates
const shownToasts = new Set<string>();

/**
 * Displays a toast notification based on the message code in URL search parameters
 * @param {ReadonlyURLSearchParams} searchParams - URL search parameters containing the message code
 */
const handleToast = (searchParams: ReadonlyURLSearchParams) => {
  // Extract message code from search parameters
  const code = searchParams.get("msg");

  // Check if code exists, is a valid number, and hasn't been shown before
  if (code && Number(code) && !shownToasts.has(code)) {
    // Decode the message code to get message details
    const info = decodeMsg(Number(code) as MessageCode);

    // If valid message info is found, display toast
    if (info) {
      toastr({
        message: info.message,
        toastrType: info.type,
      });
      // Add code to shownToasts to prevent duplicate toasts
      shownToasts.add(code);
    }
  }
};

export default handleToast;
