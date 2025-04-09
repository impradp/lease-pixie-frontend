import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DepositAccountsCard from "./DepositAccountCard";

// Mock the PixieCardHeader component to match the existing snapshot
jest.mock("../ui/header/PixieCardHeader", () => {
  return function MockPixieCardHeader({
    label,
    isEditable,
    showAddIcon,
  }: {
    label: string;
    isEditable: boolean;
    showAddIcon: boolean;
  }) {
    return (
      <div data-testid="pixie-card-header">
        {label}
        {isEditable && <span data-testid="editable-indicator" />}
        {showAddIcon && <span data-testid="add-icon" />}
      </div>
    );
  };
});

describe("DepositAccountsCard", () => {
  test("renders with default props", () => {
    const { container } = render(<DepositAccountsCard />);

    // Check if the card container is rendered
    const cardContainer = container.firstChild;
    expect(cardContainer).toBeInTheDocument();

    // Check individual classes separately
    expect(cardContainer).toHaveClass("bg-tertiary-offWhite");
    expect(cardContainer).toHaveClass("rounded-[10px]");

    // Check if PixieCardHeader is rendered with correct content
    expect(screen.getByText("Deposit Accounts")).toBeInTheDocument();
    expect(screen.queryByTestId("editable-indicator")).not.toBeInTheDocument();
    expect(screen.getByTestId("add-icon")).toBeInTheDocument();
  });

  test("renders with isEditable set to true", () => {
    render(<DepositAccountsCard isEditable={true} />);

    // Check if the editable indicator is visible when isEditable is true
    expect(screen.getByTestId("editable-indicator")).toBeInTheDocument();
  });

  test("has the correct styling and layout", () => {
    const { container } = render(<DepositAccountsCard />);

    // Check the main container classes
    const cardContainer = container.firstChild;
    expect(cardContainer).toHaveClass("relative");
    expect(cardContainer).toHaveClass("w-[408px]");
    expect(cardContainer).toHaveClass("bg-tertiary-offWhite");
    expect(cardContainer).toHaveClass("rounded-[10px]");
    expect(cardContainer).toHaveClass("flex");
    expect(cardContainer).toHaveClass("flex-col");
    expect(cardContainer).toHaveClass("p-5");
    expect(cardContainer).toHaveClass("box-border");
    expect(cardContainer).toHaveClass("max-w-full");

    // Find the direct child div that wraps the header
    const headerContainer = container.querySelector(".w-full");
    expect(headerContainer).toBeInTheDocument();
  });

  // Add a test to verify correct props are passed to PixieCardHeader
  test("passes correct props to PixieCardHeader", () => {
    render(<DepositAccountsCard isEditable={true} />);

    // Check the presence of both indicators when isEditable is true
    const editableIndicator = screen.getByTestId("editable-indicator");
    const addIcon = screen.getByTestId("add-icon");

    expect(editableIndicator).toBeInTheDocument();
    expect(addIcon).toBeInTheDocument();
    expect(screen.getByText("Deposit Accounts")).toBeInTheDocument();
  });
});
