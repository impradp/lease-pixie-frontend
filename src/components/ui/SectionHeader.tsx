import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface SectionHeaderProps {
  title: string;
  onEdit?: () => void;
  onClose?: () => void;
  showEditButton?: boolean;
  showCloseButton?: boolean;
  showInfo?: boolean;
  infoContent?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onEdit,
  onClose,
  showEditButton = false,
  showCloseButton = false,
  showInfo = false,
  infoContent = "",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<"left" | "right">(
    "left"
  );
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceOnRight = window.innerWidth - rect.right;
        //Automate proper positioning where there is space.
        setTooltipPosition(spaceOnRight < 350 ? "right" : "left");
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  return (
    <div className="flex items-center gap-4 w-full">
      <div className="flex items-center">
        <div className="text-[#0f1728] text-xl font-bold font-['Inter'] leading-[30px]">
          {title}
        </div>
        {showInfo && (
          <div className="ml-4 relative">
            <button
              ref={buttonRef}
              className="text-gray-400 hover:text-gray-600 align-middle"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Image
                src="/icons/info-circle.svg"
                alt=""
                width={20}
                height={20}
              />
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
                    <div className="text-[#101828] text-xs font-['Inter']">
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
      <div className="grow h-px bg-[#cfd4dc]" />
      {showEditButton && onEdit && (
        <button
          onClick={onEdit}
          className="text-[#475466] text-sm font-semibold font-['Inter'] underline leading-tight"
        >
          Edit
        </button>
      )}
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="text-[#667085] hover:text-[#101828]"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
