import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PixieButton from "@/components/buttons/PixieButton";
import { buttonStyles } from "@/components/buttons/buttonStyles";

// Mock the buttonStyles import
jest.mock("./buttonStyles", () => ({
  buttonStyles: {
    base: "base-style",
    shadow: "shadow-style",
    states: "states-style",
    text: "text-style",
    textInner: "text-inner-style",
  },
}));

describe("PixieButton Component", () => {
  const defaultProps = {
    label: "Click Me",
  };

  it("renders with default props", () => {
    render(<PixieButton {...defaultProps} />);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute("type", "button");
    expect(button).not.toHaveAttribute("form");
  });

  it("applies the correct class names", () => {
    render(<PixieButton {...defaultProps} />);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("base-style");
    expect(button).toHaveClass("shadow-style");
    expect(button).toHaveClass("states-style");
  });

  it("applies additional class names when provided", () => {
    render(<PixieButton {...defaultProps} className="custom-class" />);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("custom-class");
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<PixieButton {...defaultProps} onClick={handleClick} />);

    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = jest.fn();
    render(<PixieButton {...defaultProps} onClick={handleClick} disabled />);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders with submit type when specified", () => {
    render(<PixieButton {...defaultProps} type="submit" />);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveAttribute("type", "submit");
  });

  it("renders with reset type when specified", () => {
    render(<PixieButton {...defaultProps} type="reset" />);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveAttribute("type", "reset");
  });

  it("associates with a form when formId is provided", () => {
    render(<PixieButton {...defaultProps} formId="login-form" />);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveAttribute("form", "login-form");
  });

  it("renders the label correctly inside nested divs", () => {
    render(<PixieButton label="Custom Button Text" />);

    const button = screen.getByRole("button", { name: /custom button text/i });
    const textDiv = button.querySelector(`.${buttonStyles.text}`);
    const textInnerDiv = button.querySelector(`.${buttonStyles.textInner}`);

    expect(textDiv).toBeInTheDocument();
    expect(textInnerDiv).toBeInTheDocument();
    expect(textInnerDiv).toHaveTextContent("Custom Button Text");
  });

  it("does not throw error when onClick is not provided", () => {
    render(<PixieButton {...defaultProps} />);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(() => fireEvent.click(button)).not.toThrow();
  });
});
