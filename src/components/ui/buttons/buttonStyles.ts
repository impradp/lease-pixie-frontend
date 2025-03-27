export const buttonStyles = {
  text: "px-0.5 flex justify-center items-center",
  textInner: "text-white text-sm font-semibold font-['Inter'] leading-tight",
  base: "h-10 px-3.5 py-2.5 bg-secondary-light rounded outline-2 outline-offset-[-2px] outline-white/10 inline-flex justify-center items-center gap-1 overflow-hidden",
  shadow:
    "shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)]",
} as const;

export const combinedButtonStyles = `${buttonStyles.base} ${buttonStyles.shadow}`;
