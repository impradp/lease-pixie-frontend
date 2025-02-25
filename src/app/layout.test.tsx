import React from "react";
import RootLayout from "@/app/layout";

// Mock the imported dependencies
jest.mock("./fonts", () => ({
  inter: { variable: "inter-font-class" },
  myanmarKhyay: { variable: "myanmar-khyay-font-class" },
}));

// Mock the Navbar component
jest.mock("@/components/layout/Navbar", () => {
  return function MockedNavbar() {
    return <nav data-testid="navbar">Mocked Navbar</nav>;
  };
});

// Mock global CSS import
jest.mock("./globals.css", () => ({}));

describe("RootLayout Component", () => {
  // Create a custom render function that doesn't wrap the component in a div
  const renderComponent = (props = {}) => {
    const defaultProps = {
      children: <div data-testid="content">Test Content</div>,
    };

    // Instead of using testing-library's render, manually call the component
    // and examine what it would render
    const layout = RootLayout({ ...defaultProps, ...props });

    // Check that we got expected structure
    expect(layout).toBeTruthy();

    // Return methods to examine props and structure
    return {
      getHtmlProps: () => {
        return layout.props;
      },
      getBodyProps: () => {
        return layout.props.children.props;
      },
      getMainProps: () => {
        return layout.props.children.props.children[1].props;
      },
      getChildrenContent: () => {
        return layout.props.children.props.children[1].props.children;
      },
    };
  };

  it("applies the correct font classes to html element", () => {
    const { getHtmlProps } = renderComponent();

    expect(getHtmlProps().className).toContain("inter-font-class");
    expect(getHtmlProps().className).toContain("myanmar-khyay-font-class");
  });

  it("sets the correct language attribute on html element", () => {
    const { getHtmlProps } = renderComponent();

    expect(getHtmlProps().lang).toBe("en");
  });

  it("applies the correct background class to body element", () => {
    const { getBodyProps } = renderComponent();

    expect(getBodyProps().className).toContain("min-h-screen");
    expect(getBodyProps().className).toContain("bg-custom-gradient");
  });

  it("renders the main content with correct classes", () => {
    const { getMainProps } = renderComponent();

    expect(getMainProps().className).toContain("max-w-[1328px]");
    expect(getMainProps().className).toContain("mx-auto");
    expect(getMainProps().className).toContain("px-4");
    expect(getMainProps().className).toContain("py-6");
  });

  it("renders the provided children within the main content", () => {
    const { getChildrenContent } = renderComponent();
    const testContent = <div data-testid="content">Test Content</div>;

    // Compare the rendered children with expected content
    expect(JSON.stringify(getChildrenContent())).toEqual(
      JSON.stringify(testContent)
    );
  });

  it("maintains the expected component structure", () => {
    // We can test the structure by examining the component tree directly
    const layout = RootLayout({
      children: <div>Test Content</div>,
    });

    // Check that the returned element is an html element
    expect(layout.type).toBe("html");

    // Check that the first child is a body element
    expect(layout.props.children.type).toBe("body");

    // Check that Navbar is included
    const bodyChildren = layout.props.children.props.children;
    expect(bodyChildren[0].type.name).toBe("MockedNavbar");

    // Check that main element exists
    expect(bodyChildren[1].type).toBe("main");
  });
});
