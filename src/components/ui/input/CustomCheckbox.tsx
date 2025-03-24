import React from "react";
import { Check } from "lucide-react";

export const CustomCheckbox: React.FC<{
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  id: string;
  isEditing?: boolean;
  labelClassName?: string;
}> = ({
  checked,
  onChange,
  label,
  id,
  isEditing = false,
  labelClassName = "text-tertiary-slateBlue text-sm font-medium",
}) => (
  <div className="flex items-center space-x-2 gap-4">
    <div className="relative w-5 h-5">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-checked={checked}
        disabled={!isEditing}
        className={`absolute w-full h-full opacity-0 z-10 ${
          isEditing ? "cursor-pointer" : "cursor-default"
        }`}
      />
      <div
        className={`absolute top-0 left-0 w-5 h-5 border rounded pointer-events-none flex items-center justify-center transition-colors ${
          checked
            ? "bg-white border-black" // White background, black border when checked
            : "bg-white border-tertiary-blueTint" // White background, tertiary border when unchecked
        }`}
      >
        {checked && <Check size={16} className="text-black" />}{" "}
        {/* Black checkmark */}
      </div>
    </div>
    <label
      htmlFor={id}
      className={`${labelClassName} font-['Inter'] leading-tight select-none ${
        isEditing ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {label}
    </label>
  </div>
);
