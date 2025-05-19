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
        <rect width={9} height={9} x={1.5} y={1.5} fill="#aa5a36" rx={1}>
          <animate
            id="svgSpinnersBlocksScale0"
            attributeName="x"
            begin="0;svgSpinnersBlocksScale1.end+0.188s"
            dur="0.75s"
            keyTimes="0;.2;1"
            values="1.5;.5;1.5"
          ></animate>
          <animate
            attributeName="y"
            begin="0;svgSpinnersBlocksScale1.end+0.188s"
            dur="0.75s"
            keyTimes="0;.2;1"
            values="1.5;.5;1.5"
          ></animate>
          <animate
            attributeName="width"
            begin="0;svgSpinnersBlocksScale1.end+0.188s"
            dur="0.75s"
            keyTimes="0;.2;1"
            values="9;11;9"
          ></animate>
          <animate
            attributeName="height"
            begin="0;svgSpinnersBlocksScale1.end+0.188s"
            dur="0.75s"
            keyTimes="0;.2;1"
            values="9;11;9"
          ></animate>
        </rect>
        <rect width={9} height={9} x={13.5} y={1.5} fill="#aa5a36" rx={1}>
          <animate
            attributeName="x"
            begin="svgSpinnersBlocksScale0.begin+0.188s"
            dur="0.75s"
            keyTimes="0;.2;1"
            values="13.5;12.5;13.5"
          ></animate>
          <animate
            attributeName="y"
            begin="svgSpinnersBlocksScale0.begin+0.188s"
            dur="0.75s"
            keyTimes="0;.2;1"
            values="1.5;.5;1.5"
          ></animate>
          <animate
            attributeName="width"
            begin="svgSpinnersBlocksScale0.begin+0.188s"
            dur="0.75s"
            keyTimes="0;.2;1"
            values="9;11;9"
          ></animate>
          <animate
            attributeName="height"
            begin="svgSpinnersBlocksScale0.begin+0.188s"
            dur="0.75s"
            keyTimes="0;.2;1"
            values="9;11;9"
          ></animate>
        </rect>
        <rect width={9} height={9} x={13.5} y={13.5} fill="#aa5a36" rx={1}>
          <animate
            attributeName="x"
            begin="svgSpinnersBlocksScale0.begin+0.375s"
            dur="0.75s"
            keyTimes="0;.2;1"
            values="13.5;12.5;13.5"
          ></animate>
          <animate
            attributeName="y"
            begin="svgSpinnersBlocksScale0.begin+0.375s"
            dur="0.75s"
            keyTimes="0;.2;1"
            values="13.5;12.5;13.5"
          ></animate>
          <animate
            attributeName="width"
            begin="svgSpinnersBlocksScale0.begin+0.375s"
            dur="0.75s"
            keyTimes="0;.2;1"
            values="9;11;9"
          ></animate>
          <animate
            attributeName="height"
            begin="svgSpinnersBlocksScale0.begin+0.375s"
            dur="0.75s"
            keyTimes="0;.2;1"
            values="9;11;9"
          ></animate>
        </rect>
        <rect width={9} height={9} x={1.5} y={13.5} fill="#aa5a36" rx={1}>
          <animate
            id="svgSpinnersBlocksScale1"
            attributeName="x"
            begin="svgSpinnersBlocksScale0.begin+0.563s"
            dur="0.75s"
            keyTimes="0;.2;1"
            values="1.5;.5;1.5"
          ></animate>
          <animate
            attributeName="y"
            begin="svgSpinnersBlocksScale0.begin+0.563s"
            dur="0.75s"
            keyTimes="0;.2;1"
            values="13.5;12.5;13.5"
          ></animate>
          <animate
            attributeName="width"
            begin="svgSpinnersBlocksScale0.begin+0.563s"
            dur="0.75s"
            keyTimes="0;.2;1"
            values="9;11;9"
          ></animate>
          <animate
            attributeName="height"
            begin="svgSpinnersBlocksScale0.begin+0.563s"
            dur="0.75s"
            keyTimes="0;.2;1"
            values="9;11;9"
          ></animate>
        </rect>
      </svg>
    </div>
  );
};

export default LoadingOverlay;
