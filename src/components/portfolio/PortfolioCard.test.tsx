import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PortfolioCard } from "./PortfolioCard";
import "@testing-library/jest-dom";

// Mock the imported components and functions
jest.mock("@/components/ui/input/CustomInput", () => ({
  __esModule: true,
  default: ({
    label,
    value,
    onChange,
    readOnly,
    isEditing,
  }: {
    label: string;
    value: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
    isEditing?: boolean;
  }) => (
    <div data-testid="custom-input">
      <label>{label}</label>
      <input
        data-testid="portfolio-input"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        readOnly={readOnly}
        data-editing={isEditing}
      />
    </div>
  ),
}));

jest.mock("@/components/ui/header/SectionHeader", () => ({
  SectionHeader: ({
    title,
    onEdit,
    onTextCancel,
    showEditButton,
    showTextCloseButton,
    editDisabled,
  }: {
    title: string;
    onEdit?: () => void;
    onTextCancel?: () => void;
    showEditButton?: boolean;
    showTextCloseButton?: boolean;
    editDisabled?: boolean;
  }) => (
    <div data-testid="section-header">
      <span>{title}</span>
      {showEditButton && (
        <button
          data-testid="edit-button"
          onClick={onEdit}
          disabled={editDisabled}
        >
          Edit
        </button>
      )}
      {showTextCloseButton && (
        <button data-testid="cancel-button" onClick={onTextCancel}>
          Cancel
        </button>
      )}
    </div>
  ),
}));

jest.mock("@/components/ui/buttons/PixieButton", () => ({
  __esModule: true,
  default: ({
    label,
    disabled,
    onClick,
    className,
  }: {
    label: string;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
  }) => (
    <button
      data-testid="pixie-button"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {label}
    </button>
  ),
}));

jest.mock("@/components/ui/buttons/CancelButton", () => ({
  __esModule: true,
  default: ({ onClick }: { onClick?: () => void }) => (
    <button data-testid="cancel-action-button" onClick={onClick}>
      Cancel
    </button>
  ),
}));

jest.mock("@/locales/loader", () => ({
  getMessages: () => ({
    portfolio: {
      name: "Portfolio Name",
    },
  }),
}));

describe("PortfolioCard", () => {
  const defaultProps = {
    portfolioName: "Test Portfolio",
    sectionId: "portfolio-section",
    editingSection: null,
    onSectionEdit: jest.fn(),
    onSectionClose: jest.fn(),
    onNameChange: jest.fn(),
    onEdit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with correct initial state", () => {
    render(<PortfolioCard {...defaultProps} />);

    // Component should be in view mode initially
    expect(screen.getByTestId("section-header")).toBeInTheDocument();
    expect(screen.getByTestId("edit-button")).toBeInTheDocument();
    expect(screen.queryByTestId("cancel-button")).not.toBeInTheDocument();

    // Input should be read-only initially
    const input = screen.getByTestId("portfolio-input");
    expect(input).toHaveAttribute("readOnly");
    expect(input).toHaveAttribute("data-editing", "false");
    expect(input).toHaveValue("Test Portfolio");

    // Action buttons should not be visible initially
    expect(screen.queryByTestId("pixie-button")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("cancel-action-button")
    ).not.toBeInTheDocument();
  });

  test("enters edit mode when edit button is clicked", () => {
    render(<PortfolioCard {...defaultProps} />);

    // Click the edit button
    fireEvent.click(screen.getByTestId("edit-button"));

    // Should call the edit callbacks
    expect(defaultProps.onSectionEdit).toHaveBeenCalledWith(
      "portfolio-section"
    );
    expect(defaultProps.onEdit).toHaveBeenCalled();

    // Header should show cancel button instead of edit button
    expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument();
    expect(screen.getByTestId("cancel-button")).toBeInTheDocument();

    // Input should be editable
    const input = screen.getByTestId("portfolio-input");
    expect(input).not.toHaveAttribute("readOnly");
    expect(input).toHaveAttribute("data-editing", "true");

    // Action buttons should be visible
    expect(screen.getByTestId("pixie-button")).toBeInTheDocument();
    expect(screen.getByTestId("cancel-action-button")).toBeInTheDocument();
  });

  test("calls onNameChange when input value changes", () => {
    render(<PortfolioCard {...defaultProps} />);

    // Enter edit mode
    fireEvent.click(screen.getByTestId("edit-button"));

    // Change the input value
    const input = screen.getByTestId("portfolio-input");
    fireEvent.change(input, { target: { value: "Updated Portfolio" } });

    // Should call onNameChange with the new value
    expect(defaultProps.onNameChange).toHaveBeenCalledWith("Updated Portfolio");
  });

  test("exits edit mode when update button is clicked", () => {
    render(<PortfolioCard {...defaultProps} />);

    // Enter edit mode
    fireEvent.click(screen.getByTestId("edit-button"));

    // Click the update button
    fireEvent.click(screen.getByTestId("pixie-button"));

    // Should call onSectionClose
    expect(defaultProps.onSectionClose).toHaveBeenCalled();

    // Should exit edit mode
    expect(screen.getByTestId("edit-button")).toBeInTheDocument();
    expect(screen.queryByTestId("cancel-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("pixie-button")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("cancel-action-button")
    ).not.toBeInTheDocument();
  });

  test("exits edit mode when cancel button is clicked", () => {
    render(<PortfolioCard {...defaultProps} />);

    // Enter edit mode
    fireEvent.click(screen.getByTestId("edit-button"));

    // Click the cancel button
    fireEvent.click(screen.getByTestId("cancel-action-button"));

    // Should call onSectionClose
    expect(defaultProps.onSectionClose).toHaveBeenCalled();

    // Should exit edit mode
    expect(screen.getByTestId("edit-button")).toBeInTheDocument();
    expect(screen.queryByTestId("cancel-button")).not.toBeInTheDocument();
  });

  test("disables edit button when another section is being edited", () => {
    render(
      <PortfolioCard {...defaultProps} editingSection="another-section" />
    );

    // Edit button should be disabled
    expect(screen.getByTestId("edit-button")).toHaveAttribute("disabled");
  });

  test("allows editing when this section is already in edit mode", () => {
    render(
      <PortfolioCard {...defaultProps} editingSection="portfolio-section" />
    );

    // Input should be editable
    expect(screen.getByTestId("edit-button")).not.toHaveAttribute("disabled");
  });

  test("applies correct styling in different modes", () => {
    const { container } = render(<PortfolioCard {...defaultProps} />);

    // Should have closed styling initially
    expect(container.firstChild).toHaveClass("bg-card-close-fill");

    // Enter edit mode
    fireEvent.click(screen.getByTestId("edit-button"));

    // Should have open styling in edit mode
    expect(container.firstChild).toHaveClass("bg-card-open-fill");
  });

  test("stores original name when entering edit mode and reverts when canceled", () => {
    render(<PortfolioCard {...defaultProps} />);

    // Enter edit mode
    fireEvent.click(screen.getByTestId("edit-button"));

    // Change the input value
    const input = screen.getByTestId("portfolio-input");
    fireEvent.change(input, { target: { value: "Updated Portfolio" } });

    // Click cancel button
    fireEvent.click(screen.getByTestId("cancel-action-button"));

    // Should revert to original name
    expect(screen.getByTestId("portfolio-input")).toHaveValue("Test Portfolio");
  });

  test("persists edited name when updating", () => {
    render(<PortfolioCard {...defaultProps} />);

    // Enter edit mode
    fireEvent.click(screen.getByTestId("edit-button"));

    // Change the input value
    const input = screen.getByTestId("portfolio-input");
    fireEvent.change(input, { target: { value: "Updated Portfolio" } });

    // Click update button
    fireEvent.click(screen.getByTestId("pixie-button"));

    // Should keep edited name
    expect(screen.getByTestId("portfolio-input")).toHaveValue(
      "Updated Portfolio"
    );

    // Enter edit mode again
    fireEvent.click(screen.getByTestId("edit-button"));

    // Click cancel button
    fireEvent.click(screen.getByTestId("cancel-action-button"));

    // Should keep the updated name as the new original
    expect(screen.getByTestId("portfolio-input")).toHaveValue(
      "Updated Portfolio"
    );
  });

  test("update button has the correct className", () => {
    render(<PortfolioCard {...defaultProps} />);

    // Enter edit mode
    fireEvent.click(screen.getByTestId("edit-button"));

    // Check if PixieButton has the correct className
    expect(screen.getByTestId("pixie-button")).toHaveClass("w-full");
  });

  test("handles optional onEdit prop correctly when undefined", () => {
    const propsWithoutOnEdit = {
      ...defaultProps,
      onEdit: undefined,
    };

    render(<PortfolioCard {...propsWithoutOnEdit} />);

    // Enter edit mode should not throw errors
    fireEvent.click(screen.getByTestId("edit-button"));

    // Component should still enter edit mode
    expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
    expect(screen.getByTestId("pixie-button")).toBeInTheDocument();
  });

  test("handles optional onNameChange prop correctly when undefined", () => {
    const propsWithoutOnNameChange = {
      ...defaultProps,
      onNameChange: undefined,
    };

    render(<PortfolioCard {...propsWithoutOnNameChange} />);

    // Enter edit mode
    fireEvent.click(screen.getByTestId("edit-button"));

    // Change input should not throw errors
    const input = screen.getByTestId("portfolio-input");
    fireEvent.change(input, { target: { value: "Updated Portfolio" } });

    // Should still allow updates
    fireEvent.click(screen.getByTestId("pixie-button"));
    expect(screen.getByTestId("portfolio-input")).toHaveValue(
      "Updated Portfolio"
    );
  });
});
