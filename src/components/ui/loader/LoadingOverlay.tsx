import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const LoadingOverlay = ({ size = 80 }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <LoadingSpinner size={size} />
    </div>
  );
};

export default LoadingOverlay;
