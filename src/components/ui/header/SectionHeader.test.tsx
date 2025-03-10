import { render, screen, fireEvent, act } from "@testing-library/react";
import { SectionHeader } from "@/components/ui/header/SectionHeader";

// Mock dependencies
const mockX = jest.fn((props: { className?: string }) => (
  <svg data-testid="x-icon" {...props} />
));
const mockInfo = jest.fn((props: { className?: string; size?: number }) => (
  <svg data-testid="info-icon" {...props} />
));

jest.mock("lucide-react", () => ({
  X: (props: { className?: string }) => mockX(props),
  Info: (props: { className?: string; size?: number }) => mockInfo(props),
}));

jest.mock("next/image", () => {
  return jest.fn(({ src, alt, width, height }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      data-testid="mock-next-image"
    />
  ));
});

describe("SectionHeader", () => {
  const defaultProps = {
    title: "Test Section",
    showEditButton: false,
    showCloseButton: false,
    showInfo: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it("renders basic header with title only", () => {
    render(<SectionHeader {...defaultProps} />);
    expect(screen.getByText("Test Section")).toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByTestId("x-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("info-icon")).not.toBeInTheDocument();
  });

  it("shows edit button and triggers onEdit when clicked", () => {
    const onEdit = jest.fn();
    render(
      <SectionHeader {...defaultProps} showEditButton={true} onEdit={onEdit} />
    );
    const editButton = screen.getByText("Edit");
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("shows edit button as disabled when editDisabled is true and does not trigger onEdit", () => {
    const onEdit = jest.fn();
    render(
      <SectionHeader
        {...defaultProps}
        showEditButton={true}
        onEdit={onEdit}
        editDisabled={true}
      />
    );
    const editButton = screen.getByText("Edit");
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("cursor-not-allowed");
    expect(editButton).toHaveAttribute("disabled");
    fireEvent.click(editButton);
    expect(onEdit).not.toHaveBeenCalled();
  });

  it("shows close button and triggers onClose when clicked", () => {
    const onClose = jest.fn();
    render(
      <SectionHeader
        {...defaultProps}
        showCloseButton={true}
        onClose={onClose}
      />
    );
    const closeButton = screen.getByTestId("x-icon");
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton.parentElement!);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockX).toHaveBeenCalledWith({ className: "w-5 h-5" });
  });

  it("shows info button and tooltip on hover", () => {
    render(
      <SectionHeader
        {...defaultProps}
        showInfo={true}
        infoContent="Title: Description"
      />
    );
    const infoButton = screen.getByTestId("info-icon");
    expect(infoButton).toBeInTheDocument();
    fireEvent.mouseEnter(infoButton.parentElement!);
    expect(screen.getByText("Title:")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    fireEvent.mouseLeave(infoButton.parentElement!);
    expect(screen.queryByText("Title:")).not.toBeInTheDocument();
    expect(mockInfo).toHaveBeenCalledWith({
      size: 20,
      className: "text-icon-info",
    });
  });

  it("positions tooltip on left when sufficient space on right", () => {
    render(
      <SectionHeader
        {...defaultProps}
        showInfo={true}
        infoContent="Test: Info"
      />
    );
    const infoButton = screen.getByTestId("info-icon");
    fireEvent.mouseEnter(infoButton.parentElement!);
    const tooltipContainer = screen.getByText("Test:").closest(".absolute");
    expect(tooltipContainer).toHaveClass("left-0");
  });

  it("positions tooltip on right when limited space on right", () => {
    Object.defineProperty(window, "innerWidth", { value: 300 });
    render(
      <SectionHeader
        {...defaultProps}
        showInfo={true}
        infoContent="Test: Info"
      />
    );
    const infoButton = screen.getByTestId("info-icon");
    fireEvent.mouseEnter(infoButton.parentElement!);
    const tooltipContainer = screen.getByText("Test:").closest(".absolute");
    expect(tooltipContainer).toHaveClass("right-0");
  });

  it("updates tooltip position on window resize", () => {
    const { rerender } = render(
      <SectionHeader
        {...defaultProps}
        showInfo={true}
        infoContent="Test: Info"
      />
    );
    const infoButton = screen.getByTestId("info-icon");
    fireEvent.mouseEnter(infoButton.parentElement!);
    let tooltipContainer = screen.getByText("Test:").closest(".absolute");
    expect(tooltipContainer).toHaveClass("left-0");

    // Wrap resize event in act
    act(() => {
      Object.defineProperty(window, "innerWidth", { value: 300 });
      window.dispatchEvent(new Event("resize"));
    });

    rerender(
      <SectionHeader
        {...defaultProps}
        showInfo={true}
        infoContent="Test: Info"
      />
    );
    fireEvent.mouseEnter(infoButton.parentElement!);
    tooltipContainer = screen.getByText("Test:").closest(".absolute");
    expect(tooltipContainer).toHaveClass("right-0");
  });

  it("cleans up resize event listener on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
    const { unmount } = render(<SectionHeader {...defaultProps} />);
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );
    removeEventListenerSpy.mockRestore();
  });
});
