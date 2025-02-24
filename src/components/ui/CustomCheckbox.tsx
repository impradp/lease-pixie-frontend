import React from "react";
import { Check } from "lucide-react";

export const CustomCheckbox: React.FC<{
  checked: boolean;
  onChange: () => void;
  label: string;
  id: string;
}> = ({ checked, onChange, label, id }) => (
  <div className="flex items-center space-x-2">
    <div className="relative w-5 h-5">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        aria-checked={checked}
        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div
        className={`absolute top-0 left-0 w-5 h-5 border rounded pointer-events-none flex items-center justify-center transition-colors ${
          checked ? "bg-black border-black" : "bg-white border-[#D0D5DD]"
        }`}
      >
        {checked && <Check size={16} className="text-white" />}
      </div>
    </div>
    <label
      htmlFor={id}
      className="text-[#344053] text-sm font-medium font-['Inter'] leading-tight cursor-pointer select-none"
    >
      {label}
    </label>
  </div>
);
