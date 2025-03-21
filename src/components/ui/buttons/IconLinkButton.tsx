import React from "react";
import { PlusCircle } from "lucide-react";

interface IconLinkButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

export const IconLinkButton: React.FC<IconLinkButtonProps> = ({
  label,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-card-open-link justify-end text-sm font-medium font-['Inter'] leading-tight ${className}`}
    >
      <PlusCircle size={20} />
      <span>{label}</span>
    </button>
  );
};
