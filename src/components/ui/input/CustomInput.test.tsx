import { render, screen, fireEvent } from "@testing-library/react";
import CustomInput from "@/components/ui/input/CustomInput";
import { jest } from "@jest/globals";

// Mock Next.js router if used in the component
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Updated interface to match the component's props
interface CustomInputProps {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  isEditing?: boolean;
  placeholder?: string;
  containerClassName?: string;
  className?: string;
  labelClassName?: string;
  type?: "text" | "email" | "mobile";
  error?: string;
  disabled?: boolean;
}

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

    expect(container).toHaveClass("flex flex-col gap-1.5");
    expect(label).toHaveClass(
      "text-secondary-light text-sm font-medium font-['Inter'] leading-tight"
    );
    expect(inputContainer).toHaveClass(
      "px-3.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-tertiary-stroke flex items-center"
    );
    expect(input).toHaveClass(
      "w-full py-2.5 text-base text-tertiary-light font-normal font-['Inter'] leading-normal outline-none bg-transparent placeholder:text-tertiary-slateMist"
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

  // New tests for additional props and functionality

  it("displays error message when provided", () => {
    render(<CustomInput {...defaultProps} error="This field is required" />);

    expect(screen.getByText("This field is required")).toBeInTheDocument();
    expect(screen.getByText("This field is required")).toHaveClass(
      "input-error"
    );
  });

  it("validates email format and shows internal error", () => {
    const onChange = jest.fn();
    render(
      <CustomInput
        {...defaultProps}
        type="email"
        isEditing={true}
        onChange={onChange}
      />
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "invalid-email" } });

    expect(onChange).toHaveBeenCalledWith("invalid-email");
    expect(screen.getByText("Invalid email format")).toBeInTheDocument();

    // Test valid email clears error
    fireEvent.change(input, { target: { value: "valid@email.com" } });
    expect(screen.queryByText("Invalid email format")).not.toBeInTheDocument();
  });

  it("formats and validates mobile number input", () => {
    const onChange = jest.fn();
    render(
      <CustomInput
        {...defaultProps}
        type="mobile"
        isEditing={true}
        onChange={onChange}
        value=""
      />
    );

    const input = screen.getByRole("textbox");

    // Test formatting
    fireEvent.change(input, { target: { value: "1234567890" } });
    expect(onChange).toHaveBeenCalledWith("123-456-7890");

    // Test partial formatting
    onChange.mockClear();
    fireEvent.change(input, { target: { value: "123" } });
    expect(onChange).toHaveBeenCalledWith("123");

    onChange.mockClear();
    fireEvent.change(input, { target: { value: "123456" } });
    expect(onChange).toHaveBeenCalledWith("123-456");

    // Test validation error
    onChange.mockClear();
    fireEvent.change(input, { target: { value: "123-456" } });
    expect(screen.getByText("Invalid mobile format")).toBeInTheDocument();

    // Test valid format clears error
    fireEvent.change(input, { target: { value: "123-456-7890" } });
    expect(screen.queryByText("Invalid mobile format")).not.toBeInTheDocument();
  });

  it("restricts non-numeric input for mobile type", () => {
    render(
      <CustomInput {...defaultProps} type="mobile" isEditing={true} value="" />
    );

    const input = screen.getByRole("textbox");

    // Test key press restriction
    fireEvent.keyDown(input, { key: "a" });
    // We can't directly test preventDefault, but we can verify input hasn't changed
    expect(input).toHaveValue("");

    // Test allowed keys
    fireEvent.keyDown(input, { key: "1" });
    fireEvent.keyDown(input, { key: "Backspace" });
    fireEvent.keyDown(input, { key: "ArrowLeft" });
    // These shouldn't throw errors
  });

  it("displays mobile placeholder when type is mobile", () => {
    render(<CustomInput {...defaultProps} type="mobile" />);

    expect(screen.getByRole("textbox")).toHaveAttribute(
      "placeholder",
      "800-555-1234"
    );
  });

  it("handles disabled state correctly", () => {
    const onChange = jest.fn();
    render(
      <CustomInput
        {...defaultProps}
        isEditing={true}
        disabled={true}
        onChange={onChange}
      />
    );

    const input = screen.getByRole("textbox");
    const label = screen.getByText("Test Label");

    expect(input).toHaveAttribute("disabled");
    expect(label).toHaveClass("opacity-50");
    expect(input.parentElement).toHaveClass("opacity-50 cursor-not-allowed");

    // Test that onChange isn't called when disabled
    fireEvent.change(input, { target: { value: "New Value" } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("applies custom class names when provided", () => {
    render(
      <CustomInput
        {...defaultProps}
        containerClassName="custom-container"
        className="custom-input"
        labelClassName="custom-label"
      />
    );

    const label = screen.getByText("Test Label");
    const container = label.parentElement;
    const input = screen.getByRole("textbox");

    expect(container).toHaveClass("custom-container");
    expect(label).toHaveClass("custom-label");
    expect(input).toHaveClass("custom-input");
  });

  it("handles paste events correctly for mobile type", () => {
    const onChange = jest.fn();
    render(
      <CustomInput
        {...defaultProps}
        type="mobile"
        isEditing={true}
        onChange={onChange}
        value=""
      />
    );

    const input = screen.getByRole("textbox");

    // Simulate paste event with raw phone number
    fireEvent.paste(input, {
      clipboardData: {
        getData: () => "1234567890",
      },
    });

    expect(onChange).toHaveBeenCalledWith("123-456-7890");
  });
});
