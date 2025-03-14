import React, { useState, useRef, useId, useEffect } from "react";
import { Info } from "lucide-react";

interface SubHeaderProps {
  label: string;
  showInfo?: boolean;
  infoContent?: string;
}

export const SubHeader: React.FC<SubHeaderProps> = ({
  label,
  showInfo = false,
  infoContent = "",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<"left" | "right">(
    "left"
  );
  const inputId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceOnRight = window.innerWidth - rect.right;
        setTooltipPosition(spaceOnRight < 350 ? "right" : "left");
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  return (
    <div className="flex items-center gap-4">
      <label
        htmlFor={inputId}
        className="text-base font-semibold leading-[30px] text-tertiary-deepNavy"
      >
        {label}
      </label>
      {showInfo && (
        <div className=" relative">
          <button
            ref={buttonRef}
            className="flex items-center text-gray-400 hover:text-gray-600 align-middle"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info size={20} className="text-icon-info" />
          </button>
          {showTooltip && (
            <div
              className={`absolute z-50 mt-2 ${
                tooltipPosition === "right" ? "right-0" : "left-0"
              }`}
            >
              <div className="w-[300px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] bg-white rounded-lg">
                <svg
                  className={`absolute -top-4 ${
                    tooltipPosition === "right" ? "right-2" : "left-2"
                  }`}
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 0L20 16H0L10 0Z" fill="white" />
                </svg>
                <div className="p-4">
                  <div className="text-card-open-regular text-xs font-['Inter']">
                    <span className="font-bold">
                      {infoContent.split(":")[0]}:{" "}
                    </span>
                    <span>{infoContent.split(":").slice(1).join(":")} </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubHeader;
