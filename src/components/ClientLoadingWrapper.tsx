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
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    window.addEventListener("routeChangeStart", handleStart);
    window.addEventListener("routeChangeComplete", handleComplete);
    window.addEventListener("routeChangeError", handleComplete);

    return () => {
      window.removeEventListener("routeChangeStart", handleStart);
      window.removeEventListener("routeChangeComplete", handleComplete);
      window.removeEventListener("routeChangeError", handleComplete);
    };
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <LoadingContext.Provider value={{ setLoading: setIsLoading, isLoading }}>
      {isLoading && <LoadingOverlay />}
      {children}
    </LoadingContext.Provider>
  );
}
