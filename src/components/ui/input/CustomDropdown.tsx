import React, { useState, useRef, useEffect, useId } from "react";

import { ChevronRight, Info } from "lucide-react";
import { DropdownOption } from "@/types/user";

interface CustomDropdownProps {
  label?: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: DropdownOption) => void;
  readOnly?: boolean;
  isEditing: boolean;
  isLocked?: boolean;
  lockMessage?: string;
  showInfo?: boolean;
  infoContent?: string;
  isRequired?: boolean;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label = "",
  options,
  value = "",
  onChange,
  readOnly = false,
  isEditing,
  lockMessage,
  isLocked = false,
  showInfo = false,
  infoContent = "",
  isRequired = false,
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
    ? { label: lockMessage, value: "", subLabel: "" }
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
    setSelectedValue(option.value);
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

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<"left" | "right">(
    "left"
  );
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceOnRight = window.innerWidth - rect.right;
        setTooltipPosition(spaceOnRight < 350 ? "right" : "left");
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  return (
    <div className="flex flex-col gap-1.5 w-full" ref={dropdownRef}>
      {/* Combine label and tooltip in a flex container */}
      <div className="flex items-center gap-2">
        <label
          htmlFor={inputId}
          className="text-card-input-label text-sm font-medium font-['Inter'] leading-tight"
        >
          {label}
          {isRequired && <span className="text-[#878aa4] text-sm "> *</span>}
        </label>
        {showInfo && (
          <div className="relative">
            <button
              ref={buttonRef}
              className="text-gray-400 hover:text-gray-600 align-middle"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Info size={20} className="text-icon-info" />
            </button>
            {showTooltip && (
              <div
                className={`absolute z-50 mt-2 ${
                  tooltipPosition === "right" ? "right-0" : "left-0"
                }`}
              >
                <div className="w-[300px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] bg-white rounded-lg">
                  <svg
                    className={`absolute -top-4 ${
                      tooltipPosition === "right" ? "right-2" : "left-2"
                    }`}
                    width="20"
                    height="16"
                    viewBox="0 0 20 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 0L20 16H0L10 0Z" fill="white" />
                  </svg>
                  <div className="p-4">
                    <div className="text-card-open-regular text-xs font-['Inter']">
                      <span className="font-bold">
                        {infoContent.split(":")[0]}:{" "}
                      </span>
                      <span>{infoContent.split(":").slice(1).join(":")} </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
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
          aria-label={label}
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
                {selectedOption.subLabel || "\u00A0"}
              </div>
            )}
          </div>
          {isEditing && !readOnly && !isLocked && (
            <ChevronRight
              className={`w-4 h-4 text-tertiary-slateMist transition-transform duration-300 ${
                isOpen && !isLocked ? "rotate-90" : ""
              }`}
            />
          )}
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
            className="absolute z-10 w-full mt-1 bg-dropdown-fill rounded-lg shadow-lg border border-dropdown-stroke max-h-[490px] overflow-auto p-0 m-0 list-none"
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
                        {option.subLabel || "\u00A0"}
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
