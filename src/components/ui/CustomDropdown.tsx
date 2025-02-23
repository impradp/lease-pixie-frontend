import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { User } from "@/types/user";

interface CustomDropdownProps {
  label?: string;
  options: User[];
  value?: User;
  onChange?: (value: User) => void;
  readOnly?: boolean;
  isEditing: boolean;
  labelSuffix?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label = "",
  options,
  value,
  onChange,
  readOnly = false,
  isEditing,
  labelSuffix = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (!readOnly && isEditing) {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1.5 w-full" ref={dropdownRef}>
      <label className="text-[#344053] text-sm font-medium font-['Inter'] leading-tight">
        {label ? label : "Selected " + labelSuffix}
      </label>
      <div className="relative w-full">
        <div
          onClick={handleClick}
          className={`px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border border-[#cfd4dc] flex items-center justify-between cursor-${
            isEditing && !readOnly ? "pointer" : "default"
          }`}
        >
          <span className="text-[#0f1728] text-base font-normal font-['Inter'] leading-normal">
            {value
              ? value.name
              : labelSuffix == "Vendor"
              ? "Select vendor"
              : "Select user"}
          </span>
          <ChevronDown className="w-5 h-5 text-[#667085]" />
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-[#cfd4dc] max-h-60 overflow-auto">
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  if (onChange) {
                    onChange(option);
                    setIsOpen(false);
                  }
                }}
                className={`px-3.5 py-2.5 hover:bg-[#f2f2f2] cursor-pointer ${
                  !option.isActive ? "opacity-50" : ""
                }`}
              >
                <div className="text-[#0f1728] text-base font-normal">
                  {option.name}
                </div>
                <div className="text-[#667085] text-sm">{option.email}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
