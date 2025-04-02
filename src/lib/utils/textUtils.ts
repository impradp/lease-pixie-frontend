export function ellipseCharacter(text: string, maxLength: number): string {
  if (typeof text !== "string") {
    throw new Error("Input must be a string");
  }
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}..`;
}
