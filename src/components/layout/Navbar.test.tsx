import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "@/components/layout/Navbar";

// Mock the next/image component
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

describe("Navbar Component", () => {
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
  });

  it("renders the hamburger menu button", () => {
    render(<Navbar />);

    // Check for the menu button
    const menuButton = screen.getByRole("button");
    expect(menuButton).toBeInTheDocument();

    // Check for the hamburger icon
    const hamburgerIcon = screen.getByTestId("image-menu-01");
    expect(hamburgerIcon).toBeInTheDocument();
    expect(hamburgerIcon).toHaveAttribute("src", "/icons/hamburger.svg");
  });

  it("applies hover styles to the menu button on hover", () => {
    render(<Navbar />);

    const menuButton = screen.getByRole("button");

    // Check initial styles
    expect(menuButton).toHaveClass("p-2");
    expect(menuButton).toHaveClass("hover:bg-gray-100");
    expect(menuButton).toHaveClass("rounded-lg");
    expect(menuButton).toHaveClass("transition-colors");

    // Note: We can't directly test CSS pseudo-classes like :hover with React Testing Library
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
    expect(mainContainer).toHaveClass("flex-col");

    // Check for the inner container
    const innerContainer = mainContainer.firstChild as HTMLElement;
    expect(innerContainer).toHaveClass("self-stretch");
    expect(innerContainer).toHaveClass("h-[52px]");
    expect(innerContainer).toHaveClass("py-3.5");
    expect(innerContainer).toHaveClass("rounded-xl");
  });

  it("behaves correctly when menu button is clicked", () => {
    render(<Navbar />);

    const menuButton = screen.getByRole("button");

    // Simulate click event
    fireEvent.click(menuButton);

    // Note: Currently there's no state change or callback to test
    expect(menuButton).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<Navbar />);

    // Logo image should have proper alt text
    const logoImage = screen.getByTestId("image-lease-pixie-logo");
    expect(logoImage).toHaveAttribute("alt", "Lease Pixie Logo");

    // Hamburger icon should have proper alt text
    const hamburgerIcon = screen.getByTestId("image-menu-01");
    expect(hamburgerIcon).toHaveAttribute("alt", "menu-01");

    // Note: Consider adding aria-label to the menu button for better accessibility
  });
});
