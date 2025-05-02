"use client";

import React, { useEffect } from "react";
import LoadingSpinner from "@/components/ui/loader/LoadingSpinner";

const LoadingOverlay = ({ size = 50 }: { size?: number }) => {
  // Prevent background scrolling when the overlay is mounted
  useEffect(() => {
    // Save original overflow style
    const originalOverflow = document.body.style.overflow;

    // Disable scrolling
    document.body.style.overflow = "hidden";

    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <LoadingSpinner size={size} />
    </div>
  );
};

export default LoadingOverlay;
