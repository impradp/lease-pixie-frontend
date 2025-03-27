import React from "react";

const LoadingSpinner = ({ size }: { size: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52.916665 52.916667"
      version="1.1"
      id="svg1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          className="colorCycle1"
          d="M 2.6450788,46.850772 45.239291,2.6082171 46.980767,18.561953 Z"
          id="path148-0-5-6-8-7-5"
          style={{
            fillOpacity: 0.972549,
            strokeWidth: 2.96315,
            paintOrder: "stroke fill markers",
          }}
        />
        <path
          className="colorCycle2"
          d="M 3.8436179,47.770239 27.70747,33.130885 l 7.574417,-4.646559 2.200358,10.152321 z"
          id="path149-3-7-5-3-8-5"
          sodipodi-nodetypes="ccccc"
          style={{
            fillOpacity: 0.972549,
            strokeWidth: 3.27136,
            paintOrder: "stroke fill markers",
          }}
        />
        <path
          className="colorCycle3"
          d="m 5.490159,48.61096 40.519626,-9.928763 1.416723,11.9771 z"
          id="path150-9-6-5-5-4-8"
          sodipodi-nodetypes="cccc"
          style={{
            fillOpacity: 0.972549,
            strokeWidth: 2.55552,
            paintOrder: "stroke fill markers",
          }}
        />
      </g>
    </svg>
  );
};

export default LoadingSpinner;
