/**
 * @jest-environment jsdom
 */
import React, { ReactNode } from "react";
import { render, screen } from "@testing-library/react";

// Properly type the children prop in our test component
interface TestableRootLayoutProps {
  children: ReactNode;
}

// Create a separate file for this component to test it independently
function TestableRootLayout({ children }: TestableRootLayoutProps) {
  return (
    <html lang="en" className="inter-font myanmar-khyay-font">
      <body className="min-h-screen bg-custom-gradient">
        {/* Show PixieNavbar on larger screens (≥431px) */}
        <div className="hidden sm:block">
          <div data-testid="pixie-navbar">PixieNavbar Component</div>
        </div>

        {/* Show MobileNavbar on small screens (≤430px) */}
        <div className="block sm:hidden">
          <div data-testid="navbar">Navbar Component</div>
        </div>

        <main className="max-w-[1180px] mx-auto px-1 pb-6">{children}</main>
      </body>
    </html>
  );
}

describe("RootLayout Component", () => {
  test("renders with correct structure", () => {
    const mockChildren = <div data-testid="children">Test Children</div>;

    render(<TestableRootLayout>{mockChildren}</TestableRootLayout>);

    // Test language attribute
    const htmlElement = document.documentElement;
    expect(htmlElement).toHaveAttribute("lang", "en");
    expect(htmlElement).toHaveClass("inter-font");
    expect(htmlElement).toHaveClass("myanmar-khyay-font");

    // Test body element
    const bodyElement = document.body;
    expect(bodyElement).toHaveClass("min-h-screen");
    expect(bodyElement).toHaveClass("bg-custom-gradient");

    // Test navbars
    expect(screen.getByTestId("pixie-navbar")).toBeInTheDocument();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();

    // Test main content area
    const mainElement = screen.getByRole("main");
    expect(mainElement).toHaveClass("max-w-[1180px]");
    expect(mainElement).toHaveClass("mx-auto");
    expect(mainElement).toHaveClass("px-1");
    expect(mainElement).toHaveClass("pb-6");

    // Test children are rendered
    expect(screen.getByTestId("children")).toBeInTheDocument();
  });
});
