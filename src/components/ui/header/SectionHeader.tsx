import React, { useState, useRef, useEffect } from "react";
import { X, Info } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  onEdit?: () => void;
  onClose?: () => void;
  onTextCancel?: () => void;
  onAccessToggle?: (newAccess: boolean) => void;
  showEditButton?: boolean;
  showCloseButton?: boolean;
  showTextCloseButton?: boolean;
  showInfo?: boolean;
  infoContent?: string;
  editDisabled?: boolean;
  editLabel?: string;
  closeLabel?: string;
  cardActionContent?: string;
  hasAccess?: boolean;
  showCardActionContent?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onEdit,
  onClose,
  onTextCancel,
  onAccessToggle,
  showEditButton = false,
  showCloseButton = false,
  showTextCloseButton = false,
  showInfo = false,
  infoContent = "",
  editDisabled = false,
  editLabel = "Edit",
  closeLabel = "Cancel",
  cardActionContent = "",
  hasAccess = false,
  showCardActionContent = false,
}) => {
  const [localAccess, setLocalAccess] = useState(hasAccess);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<"left" | "right">(
    "left"
  );
  const [isHovered, setIsHovered] = useState(false); // Track hover state
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

  const handleAccessClick = () => {
    const newAccess = !localAccess;
    setLocalAccess(newAccess);
    onAccessToggle?.(newAccess);
  };

  // Split the cardActionContent to isolate "Can"/"Cannot"
  const contentParts = cardActionContent.split("%s");
  const beforeAccess = contentParts[0] || "";
  const afterAccess = contentParts[1] || "";
  const accessText = localAccess ? "Can" : "Cannot";

  return (
    <div className="flex items-center gap-4 w-full">
      <div className="flex items-center gap-4">
        <div className="text-card-open-regular text-xl font-bold font-['Inter'] leading-[30px]">
          {title}
        </div>
        {showInfo && (
          <div className="relative">
            <button
              ref={buttonRef}
              className="text-gray-400 hover:text-gray-600 align-middle"
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
        {!showEditButton && cardActionContent && showCardActionContent && (
          <button
            onClick={handleAccessClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="inline-flex justify-center items-center gap-1.5 overflow-hidden"
            data-hierarchy="Link gray"
            data-icon="Default"
            data-size="sm"
            data-state="Default"
            data-icon-trailing="false"
            data-icon-leading="false"
          >
            <div className="justify-start">
              <span className="text-[#475466] text-sm font-semibold font-['Inter'] leading-tight">
                {beforeAccess}
              </span>
              <span
                className={`text-[#475466] text-sm font-semibold font-['Inter'] leading-tight ${
                  isHovered ? "underline" : ""
                }`}
              >
                {accessText}
              </span>
              <span className="text-[#475466] text-sm font-semibold font-['Inter'] leading-tight">
                {afterAccess}
              </span>
            </div>
          </button>
        )}
      </div>
      <div className="grow h-px bg-card-open-stroke" />
      {showEditButton && onEdit && (
        <button
          onClick={onEdit}
          className={`text-card-open-icon text-sm font-semibold font-['Inter'] underline leading-tight ${
            editDisabled ? "cursor-not-allowed" : ""
          }`}
          disabled={editDisabled}
        >
          {editLabel}
        </button>
      )}
      {showTextCloseButton && onTextCancel && (
        <button
          onClick={onTextCancel}
          className="text-card-open-icon text-sm font-semibold font-['Inter'] underline leading-tight"
        >
          {closeLabel}
        </button>
      )}
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="text-card-open-icon hover:text-card-open-regular"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
