import React from "react";

interface LinkButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean; // Added disabled prop
  isLoading?: boolean; // Added isLoading prop
  label?: string;
  hidden?: boolean; // Added hidden prop
}

const LinkButton: React.FC<LinkButtonProps> = ({
  onClick,
  className = "",
  disabled = false,
  isLoading = false,
  label = "Cancel",
  hidden = false,
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
      hidden={hidden}
      disabled={isButtonDisabled}
      className={`text-secondary-button text-sm font-semibold underline leading-[1.43] ${
        isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {label}
    </button>
  );
};

export default LinkButton;
