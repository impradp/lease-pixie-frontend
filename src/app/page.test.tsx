import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/app/page";
import { useRouter } from "next/navigation";

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/buttons/PixieButton", () => {
  return function MockPixieButton({
    label,
    onClick,
    disabled,
  }: {
    label: string;
    onClick: () => void;
    disabled: boolean;
  }) {
    return (
      <button onClick={onClick} disabled={disabled} data-testid="pixie-button">
        {label}
      </button>
    );
  };
});

// Mock the @/locales/loader and messages
jest.mock("@/locales/loader", () => ({
  getMessages: jest.fn().mockReturnValue({
    portfolio: {
      button: {
        label: "View Portfolio",
      },
    },
  }),
}));

describe("Home Page", () => {
  let mockRouter: { push: jest.Mock };

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the PixieButton component", () => {
    render(<Home />);
    const button = screen.getByTestId("pixie-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("View Portfolio");
  });

  it("navigates to portfolio page when button is clicked", () => {
    render(<Home />);
    const button = screen.getByTestId("pixie-button");

    fireEvent.click(button);

    expect(mockRouter.push).toHaveBeenCalledWith("/portfolio");
  });
});
