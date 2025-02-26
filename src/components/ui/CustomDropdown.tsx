import React, { useState, useRef, useEffect, useId } from "react";
import { ChevronDown } from "lucide-react";
import { DropdownOption } from "@/types/user";
import { X } from "lucide-react";

interface CustomDropdownProps {
  label?: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: DropdownOption) => void;
  readOnly?: boolean;
  isEditing: boolean;
  labelSuffix?: string;
  isLocked: boolean;
  lockMessage: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label = "",
  options,
  value = "",
  onChange,
  readOnly = false,
  isEditing,
  labelSuffix = "",
  lockMessage,
  isLocked,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | "undefined">(
    value
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const inputId = useId();

  // Update selectedValue when value prop changes
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  // Find the selected option based on the selectedValue state
  const selectedOption = isLocked
    ? { label: lockMessage, value: "" }
    : selectedValue
    ? options.find((option) => option.value === selectedValue)
    : options.find((option) => option.value === "");

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

  return (
    <div className="flex flex-col gap-1.5 w-full" ref={dropdownRef}>
      <label
        htmlFor={inputId}
        className="text-card-input-label text-sm font-medium font-['Inter'] leading-tight"
      >
        {label || `Selected ${labelSuffix}`}
      </label>
      <div className="relative w-full">
        <div
          id={inputId}
          tabIndex={!readOnly && isEditing ? 0 : -1}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={`px-3.5 py-2.5 bg-card-input-fill min-h-[76px] rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border border-card-input-stroke flex items-center justify-between ${
            isEditing && !readOnly && !isLocked
              ? "cursor-pointer"
              : "cursor-default"
          }`}
          aria-label={label || `Selected ${labelSuffix}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${inputId}-options`}
        >
          <div className="flex flex-col gap-2">
            <div className="text-card-input-semibold text-base font-semibold font-['Inter'] leading-normal">
              {selectedOption?.label}
            </div>
            {selectedOption?.label && (
              <div className="text-card-input-regular text-base font-normal font-['Inter'] leading-normal">
                {selectedOption.value}
              </div>
            )}
          </div>
          {isEditing && !readOnly && !isLocked && (
            <ChevronDown className="w-5 h-5 text-card-open-icon " />
          )}

          {isLocked && <X className="w-5 h-5 text-card-open-icon " />}
        </div>

        {isOpen && !isLocked && (
          <ul
            id={`${inputId}-options`}
            role="listbox"
            ref={listboxRef}
            tabIndex={-1}
            aria-labelledby={inputId}
            aria-activedescendant={
              selectedValue ? `option-${selectedValue}` : undefined
            }
            className="absolute z-10 w-full mt-1 bg-dropdown-fill rounded-lg shadow-lg border border-dropdown-stroke max-h-60 overflow-auto p-0 m-0 list-none"
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
                  className={`px-4 py-3 hover:bg-dropdown-selected cursor-pointer ${
                    isSelected ? "bg-dropdown-selected font-medium" : ""
                  } ${!isLast ? "border-b border-dropdown-stroke" : ""}`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="text-dropdown-semibold text-base font-semibold font-['Inter'] leading-normal">
                      {option.label}
                    </div>
                    {option.value !== option.label && (
                      <div className="text-dropdown-regular text-base font-normal font-['Inter'] leading-normal">
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
