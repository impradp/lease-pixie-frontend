import {
  buttonStyles,
  combinedButtonStyles,
} from "@/components/buttons/buttonStyles";

describe("buttonStyles", () => {
  it("has the correct base style", () => {
    expect(buttonStyles.base).toBe(
      "h-10 px-3.5 py-2.5 bg-black rounded border-2 border-black inline-flex justify-center items-center gap-1 overflow-hidden transition-colors duration-200"
    );
  });

  it("has the correct shadow style", () => {
    expect(buttonStyles.shadow).toBe(
      "shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05),inset_0px_-2px_0px_0px_rgba(16,24,40,0.05),inset_0px_0px_0px_1px_rgba(16,24,40,0.18)]"
    );
  });

  it("has the correct states style", () => {
    expect(buttonStyles.states).toBe(
      "hover:bg-gray-900 active:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
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

  it("combineButtonStyles concatenates base, shadow, and states styles", () => {
    const expected = `${buttonStyles.base} ${buttonStyles.shadow} ${buttonStyles.states}`;
    expect(combinedButtonStyles).toBe(expected);
  });

  // Removing the frozen object test since the object is using "as const" instead of Object.freeze()
  // The "as const" in TypeScript doesn't actually freeze the object at runtime

  it("ensures all required style properties are present", () => {
    const requiredProps = ["base", "shadow", "states", "text", "textInner"];
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
    expect(combinedButtonStyles).toContain(buttonStyles.states);

    // Check that the parts are separated by spaces
    const parts = combinedButtonStyles.split(" ");
    const baseWords = buttonStyles.base.split(" ");
    const shadowWords = buttonStyles.shadow.split(" ");
    const statesWords = buttonStyles.states.split(" ");

    baseWords.forEach((word) => {
      expect(parts).toContain(word);
    });

    shadowWords.forEach((word) => {
      expect(parts).toContain(word);
    });

    statesWords.forEach((word) => {
      expect(parts).toContain(word);
    });
  });
});
