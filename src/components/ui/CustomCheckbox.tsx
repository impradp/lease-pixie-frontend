import React from "react";
import { Check } from "lucide-react";

export const CustomCheckbox: React.FC<{
  checked: boolean;
  onChange: () => void;
  label: string;
  id: string;
}> = ({ checked, onChange, label, id }) => (
  <div className="flex items-center space-x-2">
    <div
      id={id}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={onChange}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onChange();
        }
      }}
      className={`w-5 h-5 border rounded cursor-pointer flex items-center justify-center transition-colors ${
        checked ? "bg-black border-black" : "bg-white border-[#D0D5DD]"
      }`}
    >
      {checked && <Check size={16} className="text-white" />}
    </div>
    <label
      htmlFor={id}
      className="text-[#344053] text-sm font-medium font-['Inter'] leading-tight cursor-pointer select-none"
      onClick={onChange}
    >
      {label}
    </label>
  </div>
);
