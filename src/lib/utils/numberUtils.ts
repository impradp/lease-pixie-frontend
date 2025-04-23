/**
 * Formats a number according to international standards with comma as thousands separator
 * @param value - The number or string to format
 * @param decimalPlaces - Optional number of decimal places
 *                      - If undefined, preserves original decimal precision
 *                      - If 0, returns as whole number
 * @returns Formatted number as a string
 */
function formatNumberInternational(
  value: number | string | null | undefined,
  decimalPlaces?: number
): string {
  // Handle null or undefined inputs
  if (value === null || value === undefined) {
    return "0";
  }

  // Convert input to number for processing
  const num = typeof value === "string" ? parseFloat(value) : value;

  // Handle NaN or invalid inputs
  if (isNaN(num)) {
    return "0";
  }

  let formattedValue: string;

  if (decimalPlaces === 0) {
    // Return as whole number
    formattedValue = Math.round(num).toString();
  } else if (decimalPlaces === undefined) {
    // Preserve original decimal precision
    formattedValue = num.toString();
  } else {
    // Format with specified decimal places
    formattedValue = num.toFixed(decimalPlaces);
  }

  // Split into integer and decimal parts
  const [integerPart, decimalPart] = formattedValue.split(".");

  // Format integer part with commas as thousands separators
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );

  // Return the formatted number
  return decimalPart
    ? `${formattedIntegerPart}.${decimalPart}`
    : formattedIntegerPart;
}

export default formatNumberInternational;
