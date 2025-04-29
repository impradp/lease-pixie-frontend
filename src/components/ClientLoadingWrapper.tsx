// components/ClientLoadingWrapper.tsx
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
  const [isLoading, setIsLoading] = useState(true);
  const [isManualLoading, setIsManualLoading] = useState(false); // Track manual loading
  const pathname = usePathname();

  useEffect(() => {
    // Only show loading if not manually set
    if (!isManualLoading) {
      setIsLoading(true);
    }

    const handlePageReady = async () => {
      await new Promise<void>((resolve) => {
        if (document.readyState === "complete") {
          resolve();
        } else {
          window.addEventListener("load", () => resolve(), { once: true });
        }
      });

      await new Promise((resolve) => setTimeout(resolve, 300)); // Increased delay

      // Only clear loading if not manually set
      if (!isManualLoading) {
        setIsLoading(false);
      }
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

  // Custom setLoading to track manual loading
  const handleSetLoading = (loading: boolean) => {
    setIsManualLoading(loading);
    setIsLoading(loading);
  };

  return (
    <LoadingContext.Provider
      value={{ setLoading: handleSetLoading, isLoading }}
    >
      {isLoading && <LoadingOverlay />}
      {children}
    </LoadingContext.Provider>
  );
}
