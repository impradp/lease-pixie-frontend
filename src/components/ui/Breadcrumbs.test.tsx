import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Breadcrumbs } from "./Breadcrumbs";
import { BreadcrumbItem } from "../../types/BreadcrumbItem";

// Mock the Next.js Link component
jest.mock("next/link", () => {
  const NextLink = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return <a href={href}>{children}</a>;
  };
  NextLink.displayName = "NextLink";
  return NextLink;
});

// Mock the ellipseCharacter function - use direct mocking approach
jest.mock("../../utils/textUtils", () => ({
  ellipseCharacter: jest.fn((text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }),
}));

// Import the mocked module after mocking
import * as textUtils from "../../utils/textUtils";

describe("Breadcrumbs", () => {
  const mockItems: BreadcrumbItem[] = [
    { label: "Home", href: "/", isActive: false },
    { label: "Products", href: "/products", isActive: false },
    { label: "Category", href: "/products/category", isActive: true },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all breadcrumb items", () => {
    render(<Breadcrumbs items={mockItems} />);

    // Check if all items are rendered - now using getAllByText to handle multiple matches
    const homeItems = screen.getAllByText(/-> Home/);
    const productItems = screen.getAllByText(/-> Products/);
    const categoryItems = screen.getAllByText(/-> Category/);

    expect(homeItems.length).toBeGreaterThan(0);
    expect(productItems.length).toBeGreaterThan(0);
    expect(categoryItems.length).toBeGreaterThan(0);
  });

  it("applies active class to the active item", () => {
    render(<Breadcrumbs items={mockItems} />);

    // Test with mobile layout items (more straightforward)
    const mobileLayout = document.querySelector(".flex.xs\\:hidden");
    const spans = mobileLayout?.querySelectorAll("span");

    // The third item (index 2) should have the active class
    expect(spans?.[2]).toHaveClass("text-primary-regular");

    // Other items should have the inactive class
    expect(spans?.[0]).toHaveClass("text-primary-fade");
    expect(spans?.[1]).toHaveClass("text-primary-fade");
  });

  it("creates links with correct hrefs", () => {
    render(<Breadcrumbs items={mockItems} />);

    // Focus on mobile layout for easier testing
    const mobileLayout = document.querySelector(".flex.xs\\:hidden");
    const links = mobileLayout?.querySelectorAll("a");

    expect(links?.[0]).toHaveAttribute("href", "/");
    expect(links?.[1]).toHaveAttribute("href", "/products");
    expect(links?.[2]).toHaveAttribute("href", "/products/category");
  });

  it("calls ellipseCharacter with correct parameters", () => {
    render(<Breadcrumbs items={mockItems} />);

    // Function is called twice per item (once for desktop, once for mobile)
    // So we expect 2 * number of items calls
    expect(textUtils.ellipseCharacter).toHaveBeenCalledTimes(
      mockItems.length * 2
    );

    // Check at least one call for each item label
    mockItems.forEach((item) => {
      expect(textUtils.ellipseCharacter).toHaveBeenCalledWith(item.label, 45);
    });
  });

  it("handles single item breadcrumb correctly", () => {
    const singleItem = [mockItems[0]];
    render(<Breadcrumbs items={singleItem} />);

    // Mobile layout should have one item
    const mobileLayout = document.querySelector(".flex.xs\\:hidden");
    const mobileLinks = mobileLayout?.querySelectorAll("a");
    expect(mobileLinks?.length).toBe(1);

    // Should not render the second row in desktop layout
    const desktopLayout = document.querySelector(".hidden.xs\\:flex");
    const secondRow = desktopLayout?.querySelector("div.flex.flex-row");
    expect(secondRow?.children.length ?? 0).toBe(0);
  });

  it("renders desktop layout for non-mobile screens", () => {
    render(<Breadcrumbs items={mockItems} />);

    const desktopLayout = document.querySelector(".hidden.xs\\:flex");
    expect(desktopLayout).toBeInTheDocument();

    // First item should be rendered in the first section
    const firstRowLinks = desktopLayout?.querySelectorAll(":scope > a");
    expect(firstRowLinks?.length).toBe(1);

    // The remaining items should be in the second row
    const secondRow = desktopLayout?.querySelector(".flex.flex-row");
    const secondRowLinks = secondRow?.querySelectorAll("a");
    expect(secondRowLinks?.length).toBe(2);
  });

  it("renders mobile layout for mobile screens", () => {
    render(<Breadcrumbs items={mockItems} />);

    const mobileLayout = document.querySelector(".flex.xs\\:hidden");
    expect(mobileLayout).toBeInTheDocument();

    // All items should be in the mobile layout
    const mobileLinks = mobileLayout?.querySelectorAll("a");
    expect(mobileLinks?.length).toBe(mockItems.length);
  });

  it("handles very long text labels correctly", () => {
    const longLabelItems: BreadcrumbItem[] = [
      {
        label:
          "This is an extremely long breadcrumb label that should be ellipsed properly",
        href: "/",
        isActive: false,
      },
    ];

    render(<Breadcrumbs items={longLabelItems} />);

    // ellipseCharacter function should be called with the long text
    // It will be called twice (once for mobile, once for desktop)
    expect(textUtils.ellipseCharacter).toHaveBeenCalledWith(
      "This is an extremely long breadcrumb label that should be ellipsed properly",
      45
    );
  });
});
