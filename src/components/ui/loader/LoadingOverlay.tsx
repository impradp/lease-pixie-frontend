"use client";

import React from "react";

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={48}
        height={48}
        viewBox="0 0 24 24"
      >
        <g>
          <circle cx={3} cy={12} r={2} fill="#aa5a36"></circle>
          <circle cx={21} cy={12} r={2} fill="#aa5a36"></circle>
          <circle cx={12} cy={21} r={2} fill="#aa5a36"></circle>
          <circle cx={12} cy={3} r={2} fill="#aa5a36"></circle>
          <circle cx={5.64} cy={5.64} r={2} fill="#aa5a36"></circle>
          <circle cx={18.36} cy={18.36} r={2} fill="#aa5a36"></circle>
          <circle cx={5.64} cy={18.36} r={2} fill="#aa5a36"></circle>
          <circle cx={18.36} cy={5.64} r={2} fill="#aa5a36"></circle>
          <animateTransform
            attributeName="transform"
            dur="1.875s"
            repeatCount="indefinite"
            type="rotate"
            values="0 12 12;360 12 12"
          ></animateTransform>
        </g>
      </svg>
    </div>
  );
};

export default LoadingOverlay;
