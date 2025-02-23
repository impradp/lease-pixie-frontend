import React from "react";

interface CancelButtonProps {
  onClick: () => void;
  className?: string;
}

const CancelButton: React.FC<CancelButtonProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`text-[#475466] text-sm font-semibold underline leading-[1.43] ${className}`}
    >
      Cancel
    </button>
  );
};

export default CancelButton;
