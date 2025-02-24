import React, { useState, useRef, useEffect, useId } from "react";
import { ChevronDown } from "lucide-react";
import { DropdownOption } from "@/types/user";

interface CustomDropdownProps {
  label?: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: DropdownOption) => void;
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
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const inputId = useId();

  // Update selectedValue when value prop changes
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  // Find the selected option based on the selectedValue state
  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  const handleClick = () => {
    if (!readOnly && isEditing) {
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!readOnly && isEditing) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setIsOpen(!isOpen);
      } else if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
  };

  const handleOptionClick = (option: DropdownOption) => {
    // Update local state immediately
    setSelectedValue(option.value);

    // Call the onChange handler
    if (onChange) {
      onChange(option);
    }
    setIsOpen(false);
  };

  const handleOptionKeyDown = (
    event: React.KeyboardEvent,
    option: DropdownOption
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOptionClick(option);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef?.current &&
        !dropdownRef?.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine default text based on label suffix
  const getDefaultText = () => {
    if (labelSuffix === "Vendor") {
      return "Select vendor";
    }
    return "Select user";
  };

  // Determine display text
  const displayText = selectedOption ? selectedOption.label : getDefaultText();

  return (
    <div className="flex flex-col gap-1.5 w-full" ref={dropdownRef}>
      <label
        htmlFor={inputId}
        className="text-[#344053] text-sm font-medium font-['Inter'] leading-tight"
      >
        {label || `Selected ${labelSuffix}`}
      </label>
      <div className="relative w-full">
        <div
          id={inputId}
          tabIndex={!readOnly && isEditing ? 0 : -1}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={`px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border border-[#cfd4dc] flex items-center justify-between ${
            isEditing && !readOnly ? "cursor-pointer" : "cursor-default"
          }`}
          aria-label={label || `Selected ${labelSuffix}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${inputId}-options`}
        >
          <span className="text-[#0f1728] text-base font-normal font-['Inter'] leading-normal">
            {displayText}
          </span>
          {isEditing && !readOnly && (
            <ChevronDown className="w-5 h-5 text-[#667085]" />
          )}
        </div>

        {isOpen && (
          <ul
            id={`${inputId}-options`}
            role="listbox"
            ref={listboxRef}
            tabIndex={-1}
            aria-labelledby={inputId}
            aria-activedescendant={
              selectedValue ? `option-${selectedValue}` : undefined
            }
            className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-[#cfd4dc] max-h-60 overflow-auto p-0 m-0 list-none"
          >
            {options.map((option, index) => {
              const isSelected = option.value === selectedValue;
              const isLast = index === options.length - 1;
              return (
                <li
                  id={`option-${option.value}`}
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleOptionClick(option)}
                  onKeyDown={(e) => handleOptionKeyDown(e, option)}
                  tabIndex={0}
                  className={`px-4 py-3 hover:bg-[#f2f2f2] cursor-pointer ${
                    isSelected ? "bg-[#f8f9fa] font-medium" : ""
                  } ${!isLast ? "border-b border-[#d0d5dd]" : ""}`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="text-[#101828] text-base font-semibold font-['Inter'] leading-normal">
                      {option.label}
                    </div>
                    {option.value !== option.label && (
                      <div className="text-[#667085] text-base font-normal font-['Inter'] leading-normal">
                        {option.value}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
