import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LinkButton from "@/components/ui/buttons/LinkButton";

describe("CancelButton Component", () => {
  const defaultProps = {
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with the text "Cancel"', () => {
    render(<LinkButton {...defaultProps} />);

    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    render(<LinkButton {...defaultProps} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('has type="button" attribute', () => {
    render(<LinkButton {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "button");
  });

  it("applies default classes", () => {
    render(<LinkButton {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "text-secondary-button text-sm font-semibold underline leading-[1.43]"
    );
    expect(button).toHaveClass("text-sm");
    expect(button).toHaveClass("font-semibold");
    expect(button).toHaveClass("underline");
    expect(button).toHaveClass("leading-[1.43]");
  });

  it("applies additional custom classes when provided", () => {
    render(<LinkButton {...defaultProps} className="custom-class" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("renders as a button element", () => {
    render(<LinkButton {...defaultProps} />);

    const button = screen.getByText("Cancel");
    expect(button.tagName).toBe("BUTTON");
  });

  it("applies all classes together in the correct order", () => {
    const customClass = "mt-4 ml-2";
    render(<LinkButton {...defaultProps} className={customClass} />);

    const button = screen.getByRole("button");
    const classNames = button.className.split(" ");

    // Check that default classes come before custom classes
    const defaultClassesIndex = classNames.findIndex(
      (c) =>
        c ===
        "text-secondary-button text-sm font-semibold underline leading-[1.43]"
    );
    const customClassIndex = classNames.findIndex((c) => c === "mt-4");

    expect(defaultClassesIndex).toBeLessThan(customClassIndex);
  });
});
