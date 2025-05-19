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
        <rect width={6} height={14} x={1} y={4} fill="#aa5a36">
          <animate
            id="svgSpinnersBarsScaleFade0"
            fill="freeze"
            attributeName="y"
            begin="0;svgSpinnersBarsScaleFade1.end-0.313s"
            dur="0.938s"
            values="1;5"
          ></animate>
          <animate
            fill="freeze"
            attributeName="height"
            begin="0;svgSpinnersBarsScaleFade1.end-0.313s"
            dur="0.938s"
            values="22;14"
          ></animate>
          <animate
            fill="freeze"
            attributeName="opacity"
            begin="0;svgSpinnersBarsScaleFade1.end-0.313s"
            dur="0.938s"
            values="1;0.2"
          ></animate>
        </rect>
        <rect width={6} height={14} x={9} y={4} fill="#aa5a36" opacity={0.4}>
          <animate
            fill="freeze"
            attributeName="y"
            begin="svgSpinnersBarsScaleFade0.begin+0.188s"
            dur="0.938s"
            values="1;5"
          ></animate>
          <animate
            fill="freeze"
            attributeName="height"
            begin="svgSpinnersBarsScaleFade0.begin+0.188s"
            dur="0.938s"
            values="22;14"
          ></animate>
          <animate
            fill="freeze"
            attributeName="opacity"
            begin="svgSpinnersBarsScaleFade0.begin+0.188s"
            dur="0.938s"
            values="1;0.2"
          ></animate>
        </rect>
        <rect width={6} height={14} x={17} y={4} fill="#aa5a36" opacity={0.3}>
          <animate
            id="svgSpinnersBarsScaleFade1"
            fill="freeze"
            attributeName="y"
            begin="svgSpinnersBarsScaleFade0.begin+0.375s"
            dur="0.938s"
            values="1;5"
          ></animate>
          <animate
            fill="freeze"
            attributeName="height"
            begin="svgSpinnersBarsScaleFade0.begin+0.375s"
            dur="0.938s"
            values="22;14"
          ></animate>
          <animate
            fill="freeze"
            attributeName="opacity"
            begin="svgSpinnersBarsScaleFade0.begin+0.375s"
            dur="0.938s"
            values="1;0.2"
          ></animate>
        </rect>
      </svg>
    </div>
  );
};

export default LoadingOverlay;
