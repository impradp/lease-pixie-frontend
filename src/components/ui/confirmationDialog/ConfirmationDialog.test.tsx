import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmationDialog from "@/components/ui/confirmationDialog/ConfirmationDialog";

jest.mock("lucide-react", () => ({
  X: () => <svg data-testid="mock-x-icon" />,
}));

describe("ConfirmationDialog", () => {
  it("renders when isOpen is true", () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        onClose={jest.fn()}
        title="Test Title"
        message="Test Message"
      />
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Message")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <ConfirmationDialog
        isOpen={false}
        onClose={jest.fn()}
        title="Test Title"
        message="Test Message"
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("calls onClose when close button is clicked", () => {
    const mockOnClose = jest.fn();

    render(
      <ConfirmationDialog
        isOpen={true}
        onClose={mockOnClose}
        title="Test Title"
        message="Test Message"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /close dialog/i }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
