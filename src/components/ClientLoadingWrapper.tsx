"use client";

import { useState, useEffect, createContext } from "react";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";
import { usePathname } from "next/navigation";

export const LoadingContext = createContext<{
  setLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}>({
  setLoading: () => {},
  isLoading: false,
});

export default function ClientLoadingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true); // Start with loading true to cover initial load
  const pathname = usePathname();

  useEffect(() => {
    // Show loading state on pathname change (navigation starts)
    setIsLoading(true);

    // Simulate the end of the navigation by waiting for the page to be ready
    const handlePageReady = async () => {
      // Wait for the DOM to be fully loaded (including hydration)
      await new Promise<void>((resolve) => {
        if (document.readyState === "complete") {
          resolve();
        } else {
          window.addEventListener("load", () => resolve(), { once: true });
        }
      });

      // Add a small delay to ensure React has finished rendering
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Clear loading state once the page is fully loaded
      setIsLoading(false);
    };

    handlePageReady();

    // Cleanup
    return () => {
      setIsLoading(false); // Ensure loading state is cleared on unmount
    };
  }, [pathname]); // Trigger on every pathname change

  // Handle initial page load
  useEffect(() => {
    const handleInitialLoad = () => {
      if (document.readyState === "complete") {
        setIsLoading(false);
      }
    };

    window.addEventListener("load", handleInitialLoad);
    if (document.readyState === "complete") {
      setIsLoading(false);
    }

    return () => {
      window.removeEventListener("load", handleInitialLoad);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ setLoading: setIsLoading, isLoading }}>
      {isLoading && <LoadingOverlay />}
      {children}
    </LoadingContext.Provider>
  );
}
