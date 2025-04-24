import React from "react";
import { buttonStyles } from "./buttonStyles";

interface PixieButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean; // Added isLoading prop
  className?: string;
  label: string;
  type?: "button" | "submit" | "reset";
  formId?: string;
}

const PixieButton: React.FC<PixieButtonProps> = ({
  onClick,
  disabled = false,
  isLoading = false, // Default to false
  className = "",
  label,
  type = "button",
  formId,
}) => {
  const handleClick = () => {
    if (onClick && !isLoading && !disabled) {
      onClick();
    }
  };

  // Combine disabled and isLoading states for the button
  const isButtonDisabled = disabled || isLoading;

  return (
    <button
      onClick={handleClick}
      disabled={isButtonDisabled}
      className={`${buttonStyles.base} ${buttonStyles.shadow} ${className} ${
        isLoading ?? disabled ? "opacity-75 cursor-not-allowed" : ""
      }`}
      type={type}
      form={formId}
    >
      <div className={buttonStyles.text}>
        <div className={buttonStyles.textInner}>
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading...
            </span>
          ) : (
            label
          )}
        </div>
      </div>
    </button>
  );
};

export default PixieButton;
