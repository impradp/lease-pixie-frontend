"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const LoadingSpinner = ({ size = 50 }: { size?: number }) => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [dotCount, setDotCount] = useState(1);
  const totalFrames = 6;

  useEffect(() => {
    // Preload all images using browser's Image constructor
    for (let i = 1; i <= totalFrames; i++) {
      const imgElement = new window.Image();
      imgElement.src = `/loading-frames/frame-${i}.png`;
    }

    // Frame animation interval
    const frameInterval = setInterval(() => {
      setCurrentFrame((prev) => (prev % totalFrames) + 1);
    }, 150);

    // Dots animation interval (slower than the frame animation)
    const dotsInterval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 500);

    return () => {
      clearInterval(frameInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  // Generate the dots based on current dot count
  const dots = ".".repeat(dotCount);

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div className="relative" style={{ width: size, height: size }}>
          <Image
            src={`/loading-frames/frame-${currentFrame}.png`}
            alt={`Loading frame ${currentFrame}`}
            width={size}
            height={size}
            priority
          />
        </div>
      </div>
      <div className="mt-2 text-center font-medium text-primary-fill">
        Loading{dots}
      </div>
    </div>
  );
};

export default LoadingSpinner;
