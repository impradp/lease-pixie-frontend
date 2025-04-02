import toastr from "@/lib/func/toastr";

interface HandleErrorOptions {
  message: string;
  error?: unknown; // Optional original error object for logging
}

/**
 * Handles errors by logging them and displaying a toast notification
 * @param options - Error handling options
 */
const handleError = ({ message, error }: HandleErrorOptions): void => {
  // Log the error to console (you could replace this with a more sophisticated logging service)
  if (error) {
    console.error(`Exception: ${message}`, error);
  } else {
    console.error(`Error: ${message}`);
  }

  // Display toast notification
  toastr({
    message: `${message}`, // You could customize the format further if needed
    toastrType: "error",
  });
};

export default handleError;
