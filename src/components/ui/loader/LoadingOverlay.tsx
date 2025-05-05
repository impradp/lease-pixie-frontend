"use client";

import React from "react";
import LoadingSpinner from "@/components/ui/loader/LoadingSpinner";

const LoadingOverlay = ({ size = 50 }: { size?: number }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <LoadingSpinner size={size} />
    </div>
  );
};

export default LoadingOverlay;
