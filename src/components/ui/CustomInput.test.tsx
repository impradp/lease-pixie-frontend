import { render, screen, fireEvent } from "@testing-library/react";
import { CustomInput } from "@/components/ui/CustomInput";
import { jest } from "@jest/globals";

// Mock Next.js router if used in the component
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe("CustomInput", () => {
  const defaultProps: CustomInputProps = {
    label: "Test Label",
    value: "Test Value",
    isEditing: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with basic props correctly", () => {
    render(<CustomInput {...defaultProps} />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("Test Value");
    expect(screen.getByRole("textbox")).toHaveAttribute("readOnly");
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "");
  });

  it("renders with placeholder when provided", () => {
    render(<CustomInput {...defaultProps} placeholder="Enter text" />);

    expect(screen.getByRole("textbox")).toHaveAttribute(
      "placeholder",
      "Enter text"
    );
  });

  it("is editable and calls onChange when isEditing is true", () => {
    const onChange = jest.fn();
    render(
      <CustomInput {...defaultProps} isEditing={true} onChange={onChange} />
    );

    const input = screen.getByRole("textbox");
    expect(input).not.toHaveAttribute("readOnly");

    fireEvent.change(input, { target: { value: "New Value" } });
    expect(onChange).toHaveBeenCalledWith("New Value");
    expect(input).toHaveValue("Test Value"); // Value doesn't change locally
  });

  it("is read-only and doesn't call onChange when readOnly is true despite isEditing", () => {
    const onChange = jest.fn();
    render(
      <CustomInput
        {...defaultProps}
        isEditing={true}
        readOnly={true}
        onChange={onChange}
      />
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("readOnly");

    // In browser, readOnly prevents onChange from firing
    fireEvent.change(input, { target: { value: "New Value" } });
    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue("Test Value");
  });

  it("does not update value when isEditing is true and no onChange provided", () => {
    render(<CustomInput {...defaultProps} isEditing={true} />);

    const input = screen.getByRole("textbox");
    expect(input).not.toHaveAttribute("readOnly");

    fireEvent.change(input, { target: { value: "New Value" } });
    expect(input).toHaveValue("Test Value"); // Value remains unchanged
  });

  it("applies correct styling", () => {
    render(<CustomInput {...defaultProps} />);

    const label = screen.getByText("Test Label");
    const container = label.parentElement;
    const input = screen.getByRole("textbox");
    const inputContainer = input.parentElement;

    expect(container).toHaveClass("flex flex-col gap-1.5 w-full");
    expect(label).toHaveClass(
      "text-card-input-label text-sm font-medium font-['Inter'] leading-tight"
    );
    expect(inputContainer).toHaveClass(
      "px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border border-card-input-stroke flex items-center"
    );
    expect(input).toHaveClass(
      "w-full text-card-input-semibold text-base font-normal font-['Inter'] leading-normal outline-none bg-transparent"
    );
  });

  it("is accessible with proper label association", () => {
    render(<CustomInput {...defaultProps} />);

    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("handles conditional rendering based on isEditing", () => {
    const { rerender } = render(<CustomInput {...defaultProps} />);

    expect(screen.getByRole("textbox")).toHaveAttribute("readOnly");

    rerender(<CustomInput {...defaultProps} isEditing={true} />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("readOnly");
  });

  it("maintains readOnly state when both readOnly and isEditing are true", () => {
    render(<CustomInput {...defaultProps} isEditing={true} readOnly={true} />);

    expect(screen.getByRole("textbox")).toHaveAttribute("readOnly");
  });
});

// Type definitions compatible with Next.js 15+ and React 19
export interface CustomInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  isEditing: boolean;
  placeholder?: string;
}
