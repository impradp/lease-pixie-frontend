import React from "react";

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  isDisabled?: boolean; // Optional prop to control disabled state
  className?: string; // Optional prop for custom classes
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isOn,
  onToggle,
  isDisabled = false,
  className = "", // Default to empty string if not provided
}) => {
  return (
    <div
      className={`w-9 h-5 rounded-xl flex items-center overflow-hidden ${
        isOn ? "bg-secondary-space" : "bg-primary-space"
      } ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"} ${className}`}
      onClick={isDisabled ? undefined : onToggle}
      style={{ minWidth: "36px" }} // Fallback inline style for width
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.10)] transform transition-transform duration-200 ${
          isOn ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </div>
  );
};
