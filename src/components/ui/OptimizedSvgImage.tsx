"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface OptimizedSvgImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export default function OptimizedSvgImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
}: OptimizedSvgImageProps): React.ReactElement {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check for iOS/iPadOS devices
    const isIOSDevice =
      typeof navigator !== "undefined" &&
      (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

    setIsIOS(isIOSDevice);
  }, []);

  // For SVG files
  if (src.endsWith(".svg")) {
    if (isIOS) {
      // For iOS, fetch and inline the SVG for better rendering
      return (
        <InlineSvg
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
        />
      );
    }

    // For non-iOS devices with SVGs, use standard img tag with optimizations
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          objectFit: "contain",
          // Improve SVG rendering
          shapeRendering: "crispEdges",
          // Disable antialiasing
          imageRendering: "-webkit-optimize-contrast",
        }}
        className={className}
      />
    );
  }

  // For non-SVG images
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={100}
      className={className}
      priority={priority}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        objectFit: "contain",
      }}
    />
  );
}

// Component to fetch and inline SVG content
function InlineSvg({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}): React.ReactElement {
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    // Fetch the SVG file
    fetch(src)
      .then((response) => response.text())
      .then((text) => {
        // Extract the SVG content
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(text, "image/svg+xml");
        const svgElement = svgDoc.querySelector("svg");

        if (svgElement) {
          // Add optimizations for iOS rendering
          svgElement.setAttribute("shape-rendering", "crispEdges");
          svgElement.setAttribute("width", String(width));
          svgElement.setAttribute("height", String(height));

          // Convert back to string
          const serializer = new XMLSerializer();
          const optimizedSvg = serializer.serializeToString(svgElement);
          setSvgContent(optimizedSvg);
        }
      })
      .catch((error) => {
        console.error("Error fetching SVG:", error);
      });
  }, [src, width, height]);

  if (!svgContent) {
    // Show placeholder while loading
    return (
      <div
        style={{ width: `${width}px`, height: `${height}px` }}
        className={className}
        aria-label={alt}
      />
    );
  }

  // Render the SVG inline with optimizations
  return (
    <div
      dangerouslySetInnerHTML={{ __html: svgContent }}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: "inline-block",
      }}
      className={className}
      aria-label={alt}
    />
  );
}
