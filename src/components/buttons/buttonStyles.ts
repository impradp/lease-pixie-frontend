export const buttonStyles = {
  base: "h-10 px-3.5 py-2.5 bg-primary-button rounded border-2 border-primary-button inline-flex justify-center items-center gap-1 overflow-hidden transition-colors duration-200",
  shadow:
    "shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05),inset_0px_-2px_0px_0px_rgba(16,24,40,0.05),inset_0px_0px_0px_1px_rgba(16,24,40,0.18)]",
  // states:
  //   "hover:bg-gray-900 active:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed",
  text: "px-0.5 flex justify-center items-center",
  textInner: "text-white text-sm font-semibold font-['Inter'] leading-tight",
} as const;

export const combinedButtonStyles = `${buttonStyles.base} ${buttonStyles.shadow}`;
