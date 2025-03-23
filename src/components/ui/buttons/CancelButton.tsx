import React from "react";

interface CancelButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean; // Added disabled prop
  isLoading?: boolean; // Added isLoading prop
}

const CancelButton: React.FC<CancelButtonProps> = ({
  onClick,
  className = "",
  disabled = false,
  isLoading = false,
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
        isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {isLoading ? "Cancelling..." : "Cancel"}
    </button>
  );
};

export default CancelButton;
