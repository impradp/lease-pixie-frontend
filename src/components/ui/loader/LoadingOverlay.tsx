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
            id="svgSpinners3DotsBounce0"
            attributeName="cy"
            begin="0;svgSpinners3DotsBounce1.end+0.313s"
            calcMode="spline"
            dur="0.75s"
            keySplines=".33,.66,.66,1;.33,0,.66,.33"
            values="12;6;12"
          ></animate>
        </circle>
        <circle cx={12} cy={12} r={3} fill="#aa5a36">
          <animate
            attributeName="cy"
            begin="svgSpinners3DotsBounce0.begin+0.125s"
            calcMode="spline"
            dur="0.75s"
            keySplines=".33,.66,.66,1;.33,0,.66,.33"
            values="12;6;12"
          ></animate>
        </circle>
        <circle cx={20} cy={12} r={3} fill="#aa5a36">
          <animate
            id="svgSpinners3DotsBounce1"
            attributeName="cy"
            begin="svgSpinners3DotsBounce0.begin+0.25s"
            calcMode="spline"
            dur="0.75s"
            keySplines=".33,.66,.66,1;.33,0,.66,.33"
            values="12;6;12"
          ></animate>
        </circle>
      </svg>
    </div>
  );
};

export default LoadingOverlay;
