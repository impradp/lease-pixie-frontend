/**
 * Interpolates a string by replacing %s placeholders with provided arguments
 * @param str - The string containing %s placeholders
 * @param args - Values to replace the placeholders
 * @returns The interpolated string
 */
export function interpolate(
  str: string,
  ...args: (string | number | boolean)[]
): string {
  const parts = str.split("%s");

  if (args.length === 0 || parts.length - 1 > args.length) {
    return str;
  }

  let result = parts[0];
  for (let i = 0; i < args.length; i++) {
    const value = typeof args[i] === "boolean" ? String(args[i]) : args[i];
    result += value + (parts[i + 1] || "");
  }

  return result;
}

/**
 * Truncates a string to a specified length and appends ellipsis if needed
 * @param text - The input string to truncate
 * @param maxLength - The maximum length before truncation
 * @returns The truncated string with ellipsis if applicable
 * @throws Error if input is not a string
 */
export function ellipseCharacter(text: string, maxLength: number): string {
  if (typeof text !== "string") {
    throw new Error("Input must be a string");
  }
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}..`;
}
