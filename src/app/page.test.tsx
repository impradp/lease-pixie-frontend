import Home from "./page"; // Adjust import path
import { redirect } from "next/navigation";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("Home Page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to portfolio page", () => {
    Home(); // Call the function directly, not as JSX
    expect(redirect).toHaveBeenCalledWith("/portfolio");
  });

  // If PixieButton is supposed to exist, it’s not in this version of Home,
  // so that test would need to be removed or rethought
});
