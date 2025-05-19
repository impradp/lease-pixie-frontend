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
        <circle cx={4} cy={12} r={3} fill="#aa5a36">
          <animate
            id="svgSpinners3DotsScale0"
            attributeName="r"
            begin="0;svgSpinners3DotsScale1.end-0.313s"
            dur="0.938s"
            values="3;.2;3"
          ></animate>
        </circle>
        <circle cx={12} cy={12} r={3} fill="#aa5a36">
          <animate
            attributeName="r"
            begin="svgSpinners3DotsScale0.end-0.75s"
            dur="0.938s"
            values="3;.2;3"
          ></animate>
        </circle>
        <circle cx={20} cy={12} r={3} fill="#aa5a36">
          <animate
            id="svgSpinners3DotsScale1"
            attributeName="r"
            begin="svgSpinners3DotsScale0.end-0.563s"
            dur="0.938s"
            values="3;.2;3"
          ></animate>
        </circle>
      </svg>
    </div>
  );
};

export default LoadingOverlay;
