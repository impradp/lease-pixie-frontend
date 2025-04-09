import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PreConfirmationDialog from "./PreConfirmationDialog";

// Mock PixieButton if needed
jest.mock("@/components/ui/buttons/PixieButton", () => {
  const MockPixieButton = (props: { onClick?: () => void; label?: string }) => (
    <button onClick={props.onClick}>{props.label}</button>
  );
  MockPixieButton.displayName = "MockPixieButton";
  return MockPixieButton;
});

describe("PreConfirmationDialog", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: "Confirm Action",
    message: "Are you sure you want to proceed?",
    confirmButtonLabel: "Confirm",
    cancelButtonLabel: "Cancel",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render when isOpen is false", () => {
    const { container } = render(
      <PreConfirmationDialog {...defaultProps} isOpen={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render title and message", () => {
    render(<PreConfirmationDialog {...defaultProps} />);
    expect(screen.getByText("Confirm Action")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to proceed?")
    ).toBeInTheDocument();
  });

  it("should call onClose when overlay is clicked", () => {
    render(<PreConfirmationDialog {...defaultProps} />);
    const [overlay] = screen.getAllByLabelText("Close dialog"); // grab first match
    fireEvent.click(overlay);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("should call onClose when X button is clicked", () => {
    render(<PreConfirmationDialog {...defaultProps} />);
    const closeButton = screen.getAllByLabelText("Close dialog")[1]; // second one is X button
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("should call onConfirm when confirm button is clicked", () => {
    render(<PreConfirmationDialog {...defaultProps} />);
    fireEvent.click(screen.getByText("Confirm"));
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it("should call onClose when cancel button is clicked", () => {
    render(<PreConfirmationDialog {...defaultProps} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
