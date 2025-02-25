import { render, screen, fireEvent } from "@testing-library/react";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import * as localeLoader from "@/locales/loader";

// Mock the imported components
jest.mock("@/components/ui/CustomInput", () => {
  return {
    CustomInput: jest.fn(({ label, value, onChange, readOnly, isEditing }) => (
      <input
        data-testid="custom-input"
        aria-label={label}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        disabled={!isEditing}
      />
    )),
  };
});

jest.mock("@/components/ui/SectionHeader", () => {
  return {
    SectionHeader: jest.fn(({ title, onEdit, showEditButton }) => (
      <div data-testid="section-header">
        <h2>{title}</h2>
        {showEditButton && (
          <button data-testid="edit-button" onClick={onEdit}>
            Edit
          </button>
        )}
      </div>
    )),
  };
});

// Mock the locale loader
jest.mock("@/locales/loader", () => ({
  getMessages: jest.fn(),
}));

describe("PortfolioCard", () => {
  const mockMessages = {
    portfolio: {
      name: "Portfolio Name",
    },
  };

  beforeEach(() => {
    (localeLoader.getMessages as jest.Mock).mockReturnValue(mockMessages);
    jest.clearAllMocks();
  });

  // Basic rendering test
  it("renders with existing portfolio correctly", () => {
    render(
      <PortfolioCard portfolioName="My Portfolio" isExistingPortfolio={true} />
    );

    expect(screen.getByTestId("section-header")).toBeInTheDocument();
    expect(screen.getByText("Portfolio Name")).toBeInTheDocument();
    expect(screen.getByTestId("custom-input")).toHaveValue("My Portfolio");
    expect(screen.getByTestId("custom-input")).toHaveAttribute("readOnly");
    expect(screen.getByTestId("edit-button")).toBeInTheDocument();
  });

  // New portfolio test
  it("renders new portfolio in editing mode", () => {
    const mockOnNameChange = jest.fn();
    render(
      <PortfolioCard
        portfolioName=""
        isExistingPortfolio={false}
        onNameChange={mockOnNameChange}
      />
    );

    const input = screen.getByTestId("custom-input");
    expect(input).not.toHaveAttribute("readOnly");
    expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument();

    // Test input change
    fireEvent.change(input, { target: { value: "New Portfolio" } });
    expect(mockOnNameChange).toHaveBeenCalledWith("New Portfolio");
  });

  // Edit button functionality
  it("triggers onEdit callback when edit button is clicked", () => {
    const mockOnEdit = jest.fn();
    render(
      <PortfolioCard
        portfolioName="Test Portfolio"
        isExistingPortfolio={true}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.getByTestId("edit-button");
    fireEvent.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  // Conditional editing mode test
  it("enables editing when onNameChange is provided for existing portfolio", () => {
    const mockOnNameChange = jest.fn();
    render(
      <PortfolioCard
        portfolioName="Existing Portfolio"
        isExistingPortfolio={true}
        onNameChange={mockOnNameChange}
      />
    );

    const input = screen.getByTestId("custom-input");
    expect(input).not.toHaveAttribute("readOnly");

    fireEvent.change(input, { target: { value: "Updated Portfolio" } });
    expect(mockOnNameChange).toHaveBeenCalledWith("Updated Portfolio");
  });

  // Props validation
  it("renders without optional callbacks", () => {
    const { container } = render(
      <PortfolioCard portfolioName="Minimal Portfolio" />
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByTestId("custom-input")).toHaveValue("Minimal Portfolio");
    expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument();
  });

  // Accessibility test
  it("has appropriate aria-labels", () => {
    render(
      <PortfolioCard
        portfolioName="Accessible Portfolio"
        isExistingPortfolio={true}
      />
    );

    const input = screen.getByTestId("custom-input");
    expect(input).toHaveAttribute("aria-label", "Portfolio Name");
  });
});
