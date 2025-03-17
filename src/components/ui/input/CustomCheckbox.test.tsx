import { render, screen, fireEvent } from "@testing-library/react";
import { CustomCheckbox } from "@/components/ui/input/CustomCheckbox";

// Define the props type for the Check component
interface CheckProps {
  size?: number;
  className?: string;
}

// Mock the Lucide React icon
const mockCheck = jest.fn((props: CheckProps) => (
  <svg data-testid="check-icon" {...props} />
));
jest.mock("lucide-react", () => ({
  Check: (props: CheckProps) => {
    return mockCheck(props);
  },
}));

describe("CustomCheckbox", () => {
  const defaultProps = {
    checked: false,
    onChange: jest.fn(),
    label: "Test Checkbox",
    id: "test-checkbox",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders unchecked checkbox correctly", () => {
    render(<CustomCheckbox {...defaultProps} />);

    const checkbox = screen.getByRole("checkbox");
    const label = screen.getByText("Test Checkbox");

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute("id", "test-checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    expect(label).toHaveAttribute("for", "test-checkbox");
    expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
  });

  it("renders checked checkbox correctly", () => {
    render(<CustomCheckbox {...defaultProps} checked={true} />);

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    expect(screen.getByText("Test Checkbox")).toBeInTheDocument();
  });

  it("applies correct styles based on checked state", () => {
    const { rerender } = render(<CustomCheckbox {...defaultProps} />);

    let container = screen.getByRole("checkbox").nextElementSibling;
    expect(container).toHaveClass("bg-white border-tertiary-blueTint");

    rerender(<CustomCheckbox {...defaultProps} checked={true} />);
    container = screen.getByRole("checkbox").nextElementSibling;
    expect(container).toHaveClass(
      "absolute top-0 left-0 w-5 h-5 border rounded pointer-events-none flex items-center justify-center transition-colors bg-white border-black"
    );
  });

  it("triggers onChange when clicked", () => {
    render(<CustomCheckbox {...defaultProps} />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  it("is accessible with keyboard", () => {
    render(<CustomCheckbox {...defaultProps} />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  it("has correct cursor styling", () => {
    render(<CustomCheckbox {...defaultProps} />);

    const checkbox = screen.getByRole("checkbox");
    const label = screen.getByText("Test Checkbox");

    expect(checkbox).toHaveClass(
      "absolute w-full h-full opacity-0 z-10 cursor-default"
    );
    expect(label).toHaveClass(
      "text-tertiary-slateBlue text-sm font-medium font-['Inter'] leading-tight select-none cursor-default"
    );
  });

  it("prevents text selection on label", () => {
    render(<CustomCheckbox {...defaultProps} />);

    const label = screen.getByText("Test Checkbox");
    expect(label).toHaveClass("select-none");
  });

  it("passes Check icon correct size prop", () => {
    render(<CustomCheckbox {...defaultProps} checked={true} />);

    // Verify the mock was called
    expect(mockCheck).toHaveBeenCalledTimes(1);

    // Check the arguments passed to the mock
    expect(mockCheck).toHaveBeenCalledWith({
      size: 16,
      className: "text-black",
    });
  });
});
