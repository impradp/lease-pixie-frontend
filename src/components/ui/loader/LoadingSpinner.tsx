"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const LoadingSpinner = ({ size = 40 }: { size?: number }) => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [dotCount, setDotCount] = useState(1);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const totalFrames = 6;

  useEffect(() => {
    // Preload all images
    const preloadImages = async () => {
      const imagePromises = [];

      for (let i = 1; i <= totalFrames; i++) {
        const promise = new Promise((resolve) => {
          const img = new window.Image(); // Use window.Image instead of Image
          img.onload = resolve;
          img.src = `/loading-frames/frame-${i}.png`;
        });
        imagePromises.push(promise);
      }

      await Promise.all(imagePromises);
      setImagesLoaded(true);
    };

    preloadImages();
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    // Frame animation interval
    const frameInterval = setInterval(() => {
      setCurrentFrame((prev) => (prev % totalFrames) + 1);
    }, 200); // Slightly slower to ensure smoother transitions

    // Dots animation interval
    const dotsInterval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 500);

    return () => {
      clearInterval(frameInterval);
      clearInterval(dotsInterval);
    };
  }, [imagesLoaded]);

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
