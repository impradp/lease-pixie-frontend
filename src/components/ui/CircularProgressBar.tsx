"use client";

import React, { useState, useEffect } from "react";

/**
 * Props for the CircularProgressBar component
 */
interface CircularProgressBarProps {
  percentage: number; // The progress percentage (0-100)
  size?: number; // Diameter of the circle in pixels (default: 18)
  strokeWidth?: number; // Thickness of the ring (default: 4.5)
}

/**
 * Renders an animated circular progress bar with a gradient
 * @param props - The properties for configuring the progress bar
 * @returns JSX.Element - The rendered circular progress bar
 */
const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  percentage,
  size = 18,
  strokeWidth = 4.5,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [currentPercentage, setCurrentPercentage] = useState(0);

  // Animate the progress bar when percentage changes
  useEffect(() => {
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100); // Clamp between 0 and 100
    const duration = 1000; // Animation duration in milliseconds
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newPercentage = progress * clampedPercentage;

      setCurrentPercentage(newPercentage);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrentPercentage(clampedPercentage); // Ensure exact final value
      }
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame); // Cleanup on unmount or percentage change
  }, [percentage]);

  const strokeDashoffset =
    circumference - (currentPercentage / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="absolute">
        <circle
          stroke="#d0d5dd"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <svg width={size} height={size} className="absolute">
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#bc62ca", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#e4984f", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        <circle
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transform -rotate-90 origin-center transition-all duration-1000"
        />
      </svg>
    </div>
  );
};

export default CircularProgressBar;
