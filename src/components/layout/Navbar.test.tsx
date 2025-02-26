import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "@/components/layout/Navbar"; // Adjust path as needed
import { useRouter } from "next/navigation";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      data-testid={`image-${alt.toLowerCase().replace(/\s/g, "-")}`}
    />
  ),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock SidebarMenu component
jest.mock("@/components/menus/SidebarMenu", () => {
  return jest.fn(({ isOpen, onClose }) =>
    isOpen ? (
      <div data-testid="sidebar-menu">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
  );
});

describe("Navbar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with logo and title", () => {
    render(<Navbar />);

    // Check for the logo image
    const logoImage = screen.getByTestId("image-lease-pixie-logo");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src", "/icons/lease-pixie-logo.svg");
    expect(logoImage).toHaveAttribute("alt", "Lease Pixie Logo");

    // Check for the title text
    const titleText = screen.getByText("Lease Pixie");
    expect(titleText).toBeInTheDocument();
    expect(titleText).toHaveClass("font-myanmar-khyay");
    expect(titleText).toHaveClass("text-primary-button");
  });

  it("renders the hamburger menu button", () => {
    render(<Navbar />);

    // Check for the menu button
    const menuButton = screen.getByRole("button", { name: /menu/i });
    expect(menuButton).toBeInTheDocument();

    // Check for the hamburger icon
    const hamburgerIcon = screen.getByTestId("image-menu");
    expect(hamburgerIcon).toBeInTheDocument();
    expect(hamburgerIcon).toHaveAttribute("src", "/icons/hamburger.svg");
    expect(hamburgerIcon).toHaveAttribute("alt", "Menu");
  });

  it("navigates to dashboard when logo is clicked", () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    render(<Navbar />);

    const logoContainer = screen.getByText("Lease Pixie").parentElement!;
    fireEvent.click(logoContainer);

    expect(mockPush).toHaveBeenCalledWith("/account/dashboard");
  });

  it("toggles the sidebar menu when hamburger button is clicked", () => {
    render(<Navbar />);

    const menuButton = screen.getByRole("button", { name: /menu/i });

    // Initially, sidebar should be closed
    expect(screen.queryByTestId("sidebar-menu")).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(menuButton);
    expect(screen.getByTestId("sidebar-menu")).toBeInTheDocument();

    // Click to close
    fireEvent.click(menuButton);
    expect(screen.queryByTestId("sidebar-menu")).not.toBeInTheDocument();
  });

  it("closes the sidebar menu when the close button is clicked", () => {
    render(<Navbar />);

    const menuButton = screen.getByRole("button", { name: /menu/i });

    // Open the menu
    fireEvent.click(menuButton);
    expect(screen.getByTestId("sidebar-menu")).toBeInTheDocument();

    // Click the close button in the mocked SidebarMenu
    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);
    expect(screen.queryByTestId("sidebar-menu")).not.toBeInTheDocument();
  });

  it("has the correct layout structure and classes", () => {
    render(<Navbar />);

    // Check for the nav element
    const navElement = screen.getByRole("navigation");
    expect(navElement).toBeInTheDocument();
    expect(navElement).toHaveClass("w-full");
    expect(navElement).toHaveClass("max-w-[1328px]");
    expect(navElement).toHaveClass("mx-auto");
    expect(navElement).toHaveClass("px-4");

    // Check for the main container div
    const mainContainer = navElement.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass("h-[92px]");
    expect(mainContainer).toHaveClass("flex");
    expect(mainContainer).toHaveClass("items-center");
    expect(mainContainer).toHaveClass("justify-between");
  });

  it("has proper accessibility attributes", () => {
    render(<Navbar />);

    // Logo image should have proper alt text
    const logoImage = screen.getByTestId("image-lease-pixie-logo");
    expect(logoImage).toHaveAttribute("alt", "Lease Pixie Logo");

    // Hamburger icon should have proper alt text
    const hamburgerIcon = screen.getByTestId("image-menu");
    expect(hamburgerIcon).toHaveAttribute("alt", "Menu");

    // Menu button should be accessible
    const menuButton = screen.getByRole("button", { name: /menu/i });
    expect(menuButton).toBeInTheDocument();
  });
});
