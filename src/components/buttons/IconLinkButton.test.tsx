import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { IconLinkButton } from "@/components/buttons/IconLinkButton";
import { PlusCircle } from "lucide-react";

// Mock the lucide-react icon
jest.mock("lucide-react", () => ({
  PlusCircle: jest.fn(() => <div data-testid="plus-circle-icon" />),
}));

describe("IconLinkButton Component", () => {
  const defaultProps = {
    label: "Add Item",
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with the correct label", () => {
    render(<IconLinkButton {...defaultProps} />);

    expect(screen.getByText("Add Item")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    render(<IconLinkButton {...defaultProps} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it("renders the PlusCircle icon", () => {
    render(<IconLinkButton {...defaultProps} />);

    expect(screen.getByTestId("plus-circle-icon")).toBeInTheDocument();
    // Simplify the test to just check if PlusCircle was called
    expect(PlusCircle).toHaveBeenCalled();
  });

  it("applies default classes", () => {
    render(<IconLinkButton {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("flex");
    expect(button).toHaveClass("items-center");
    expect(button).toHaveClass("gap-2");
    expect(button).toHaveClass(
      "flex items-center gap-2 text-card-open-link text-sm font-medium font-['Inter'] leading-tight"
    );
    expect(button).toHaveClass("text-sm");
    expect(button).toHaveClass("font-medium");
    expect(button).toHaveClass(
      "flex items-center gap-2 text-card-open-link text-sm font-medium font-['Inter'] leading-tight"
    );
  });

  it("applies additional custom classes when provided", () => {
    render(<IconLinkButton {...defaultProps} className="custom-class" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("renders the label inside a span element", () => {
    render(<IconLinkButton {...defaultProps} />);

    const labelSpan = screen.getByText("Add Item");
    expect(labelSpan.tagName).toBe("SPAN");
  });

  it("maintains correct structure with icon before label", () => {
    render(<IconLinkButton {...defaultProps} />);

    const button = screen.getByRole("button");
    const children = Array.from(button.childNodes);

    // First child should be the icon, second should be the span with the label
    expect(children[0]).toEqual(screen.getByTestId("plus-circle-icon"));
    expect(children[1]).toEqual(screen.getByText("Add Item"));
  });
});
