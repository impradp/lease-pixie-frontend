import React, { useState, useEffect } from "react";
import Image from "next/image";

const LoadingSpinner = ({ size = 50 }) => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const totalFrames = 6;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev % totalFrames) + 1);
    }, 150); // Change frame every 150ms - adjust timing as needed

    return () => clearInterval(interval);
  }, []);

  return (
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
  );
};

export default LoadingSpinner;
