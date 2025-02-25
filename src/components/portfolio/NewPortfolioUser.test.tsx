import { render, screen, fireEvent } from "@testing-library/react";
import { NewPortfolioUser } from "./NewPortfolioUser";

// Define prop interfaces for mocks
interface CustomInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

interface SectionHeaderProps {
  title: string;
  onClose: () => void;
}

interface PixieButtonProps {
  label: string;
  onClick: () => void;
}

interface CancelButtonProps {
  onClick: () => void;
}

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

jest.mock("@/components/ui/CustomInput", () => ({
  CustomInput: ({ label, value, onChange }: CustomInputProps) => (
    <input
      data-testid={`custom-input-${label}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

jest.mock("@/components/ui/SectionHeader", () => ({
  SectionHeader: ({ title, onClose }: SectionHeaderProps) => (
    <div>
      <h2>{title}</h2>
      <button onClick={onClose} data-testid="close-button">
        X
      </button>
    </div>
  ),
}));

jest.mock("@/components/buttons/PixieButton", () => ({
  __esModule: true,
  default: ({ label, onClick }: PixieButtonProps) => (
    <button onClick={onClick} data-testid="pixie-button">
      {label}
    </button>
  ),
}));

jest.mock("@/components/buttons/CancelButton", () => ({
  __esModule: true,
  default: ({ onClick }: CancelButtonProps) => (
    <button onClick={onClick} data-testid="cancel-button">
      Cancel
    </button>
  ),
}));

jest.mock("@/components/popups/ConfirmationDialog", () => ({
  __esModule: true,
  default: ({ isOpen, onClose, title, message }: ConfirmationDialogProps) =>
    isOpen ? (
      <div data-testid="confirmation-dialog">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onClose} data-testid="confirm-close-button">
          OK
        </button>
      </div>
    ) : null,
}));

jest.mock("@/locales/loader", () => ({
  getMessages: () => ({
    portfolio: {
      user: {
        modal: {
          title: "Add New User",
          button: { label: "Submit", type: "submit" },
        },
        confirmModal: {
          title: "User Created",
          message: "The new user has been successfully created.",
        },
      },
    },
  }),
}));

describe("NewPortfolioUser Component", () => {
  let mockOnClose: jest.Mock;
  let mockOnSubmit: jest.Mock;

  beforeEach(() => {
    mockOnClose = jest.fn();
    mockOnSubmit = jest.fn();
    // Removed defaultFormData since it's unused; see alternative below if you want to use it
  });

  it("renders correctly with initial form state", () => {
    render(<NewPortfolioUser onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.getByText("Add New User")).toBeInTheDocument();
    expect(screen.getByTestId("pixie-button")).toHaveTextContent("Submit");
  });

  it("updates form fields when typing", () => {
    render(<NewPortfolioUser onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByTestId("custom-input-First name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByTestId("custom-input-Last name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByTestId("custom-input-Email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByTestId("custom-input-Mobile phone"), {
      target: { value: "1234567890" },
    });

    expect(screen.getByTestId("custom-input-First name")).toHaveValue("John");
    expect(screen.getByTestId("custom-input-Last name")).toHaveValue("Doe");
    expect(screen.getByTestId("custom-input-Email")).toHaveValue(
      "john.doe@example.com"
    );
    expect(screen.getByTestId("custom-input-Mobile phone")).toHaveValue(
      "1234567890"
    );
  });

  it("calls onSubmit and opens confirmation dialog when submitted", () => {
    render(<NewPortfolioUser onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByTestId("custom-input-First name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByTestId("custom-input-Last name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByTestId("custom-input-Email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByTestId("custom-input-Mobile phone"), {
      target: { value: "1234567890" },
    });

    fireEvent.click(screen.getByTestId("pixie-button"));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      mobilePhone: "1234567890",
    });

    expect(screen.getByTestId("confirmation-dialog")).toBeInTheDocument();
    expect(screen.getByText("User Created")).toBeInTheDocument();
    expect(
      screen.getByText("The new user has been successfully created.")
    ).toBeInTheDocument();
  });

  it("closes confirmation dialog when OK is clicked", () => {
    render(<NewPortfolioUser onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByTestId("pixie-button"));
    fireEvent.click(screen.getByTestId("confirm-close-button"));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when cancel button is clicked", () => {
    render(<NewPortfolioUser onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getByTestId("cancel-button"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when modal close button is clicked", () => {
    render(<NewPortfolioUser onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getByTestId("close-button"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
