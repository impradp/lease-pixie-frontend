import {
  buttonStyles,
  combinedButtonStyles,
} from "@/components/ui/buttons/buttonStyles";

describe("buttonStyles", () => {
  it("has the correct base style", () => {
    expect(buttonStyles.base).toBe(
      "h-10 px-3.5 py-2.5 bg-secondary-light rounded outline-2 outline-offset-[-2px] outline-white/10 inline-flex justify-center items-center gap-1 overflow-hidden"
    );
  });

  it("has the correct shadow style", () => {
    expect(buttonStyles.shadow).toBe(
      "shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)]"
    );
  });

  it("has the correct text style", () => {
    expect(buttonStyles.text).toBe("px-0.5 flex justify-center items-center");
  });

  it("has the correct textInner style", () => {
    expect(buttonStyles.textInner).toBe(
      "text-white text-sm font-semibold font-['Inter'] leading-tight"
    );
  });

  it("ensures all required style properties are present", () => {
    const requiredProps = ["base", "shadow", "text", "textInner"];
    requiredProps.forEach((prop) => {
      expect(buttonStyles).toHaveProperty(prop);
      expect(typeof buttonStyles[prop as keyof typeof buttonStyles]).toBe(
        "string"
      );
    });
  });

  it("properly combines styles in combinedButtonStyles", () => {
    // Check that the combined string contains all parts
    expect(combinedButtonStyles).toContain(buttonStyles.base);
    expect(combinedButtonStyles).toContain(buttonStyles.shadow);

    // Check that the parts are separated by spaces
    const parts = combinedButtonStyles.split(" ");
    const baseWords = buttonStyles.base.split(" ");
    const shadowWords = buttonStyles.shadow.split(" ");

    baseWords.forEach((word) => {
      expect(parts).toContain(word);
    });

    shadowWords.forEach((word) => {
      expect(parts).toContain(word);
    });
  });
});
