import { Download, Upload } from "lucide-react";
import React from "react";

interface LinkButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean; // Added disabled prop
  isLoading?: boolean; // Added isLoading prop
  label?: string;
  hidden?: boolean; // Added hidden prop
  showIcon?: boolean;
  iconType?: "download" | "upload";
}

const LinkButton: React.FC<LinkButtonProps> = ({
  onClick,
  className = "",
  disabled = false,
  isLoading = false,
  label = "Cancel",
  hidden = false,
  showIcon = false,
  iconType,
}) => {
  const isButtonDisabled = disabled || isLoading;

  const handleClick = () => {
    if (!isButtonDisabled) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      disabled={isButtonDisabled}
      className={`text-secondary-button text-sm font-semibold underline leading-[1.43] ${
        hidden ? "hidden" : "flex"
      } ${
        isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {showIcon && iconType === "download" && <Download size={17} />}
      {showIcon && iconType === "upload" && <Upload size={17} />}
      <span className="ml-1"> {label}</span>
    </button>
  );
};

export default LinkButton;
