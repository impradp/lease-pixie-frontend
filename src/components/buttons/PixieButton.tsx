import React from "react";
import { buttonStyles } from "./buttonStyles";

interface PixieButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  label: string;
  type?: "button" | "submit" | "reset";
  formId?: string;
}

const PixieButton: React.FC<PixieButtonProps> = ({
  onClick,
  disabled = false,
  className = "",
  label,
  type = "button",
  formId,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (type !== "submit" && onClick) {
      onClick();
    } else if (type === "submit" && onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${buttonStyles.base} ${buttonStyles.shadow} ${buttonStyles.states} ${className}`}
      type={type}
      form={formId}
    >
      <div className={buttonStyles.text}>
        <div className={buttonStyles.textInner}>{label}</div>
      </div>
    </button>
  );
};

export default PixieButton;
