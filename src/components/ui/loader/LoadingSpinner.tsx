"use client";

import React, { useState, useEffect } from "react";

const LoadingSpinner = ({ size = 40 }: { size?: number }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [dotCount, setDotCount] = useState(1);
  const frames = [
    "/loading-frames/progress1.svg",
    "/loading-frames/progress2.svg",
    "/loading-frames/progress3.svg",
  ];

  useEffect(() => {
    const frameInterval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 200);

    const dotsInterval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 500);

    return () => {
      clearInterval(frameInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  const dots = ".".repeat(dotCount);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <img
          src={frames[currentFrame]}
          alt="Loading"
          width={size}
          height={size}
        />
      </div>
      <div className="mt-2 text-center font-medium text-primary-fill">
        Loading{dots}
      </div>
    </div>
  );
};

export default LoadingSpinner;
