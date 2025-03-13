import React, { useState, useRef, useEffect, useId } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownOption {
  value: string;
  label: string;
}

interface PixieDropdownProps {
  label?: string;
  options: (number | string)[];
  value?: string;
  onChange?: (value: DropdownOption) => void;
  readOnly?: boolean;
  isEditing: boolean;
  isLocked?: boolean;
  lockMessage?: string;
  className?: string;
  labelClassName?: string;
  placeholder?: string;
  containerClassName?: string;
}

export const PixieDropdown: React.FC<PixieDropdownProps> = ({
  label = "",
  options,
  value = "",
  onChange,
  readOnly = false,
  isEditing,
  lockMessage,
  isLocked = false,
  className = "xs:w-[153px]",
  labelClassName = "text-secondary-light text-xs font-bold leading-[18px]",
  placeholder = "Select option",
  containerClassName = "xs:w-[460px] h-[42px] gap-2",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const inputId = useId();

  // Convert options to DropdownOption format and ensure string values
  const formattedOptions: DropdownOption[] = options.map((opt) => {
    const strValue = String(opt);
    return { value: strValue, label: strValue };
  });

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const selectedOption = isLocked
    ? { label: lockMessage, value: "" }
    : formattedOptions.find((option) => option.value === selectedValue) || {
        value: "",
        label: "",
      };

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
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`w-full justify-end items-center ${containerClassName} inline-flex relative`}
      ref={dropdownRef}
    >
      <div className={`"${labelClassName} font-['Inter']`}>{label}</div>
      <div
        className={`w-full ${className} self-stretch justify-start items-center gap-2 flex`}
      >
        <div
          id={inputId}
          tabIndex={!readOnly && isEditing ? 0 : -1}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={`w-full grow shrink basis-0 h-9 px-3.5 py-2.5 bg-white rounded-lg border border-tertiary-stroke justify-start items-center gap-2 flex overflow-hidden ${
            isEditing && !readOnly && !isLocked
              ? "cursor-pointer"
              : "cursor-default"
          }`}
          aria-label={label}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${inputId}-options`}
        >
          <div className="grow shrink basis-0 h-5 justify-between items-center flex">
            <div className="justify-start items-center gap-2 flex">
              <div className="text-tertiary-light text-sm font-normal font-['Inter'] leading-tight">
                {selectedOption.value || placeholder}
              </div>
            </div>
            {isEditing && !readOnly && !isLocked && (
              <ChevronDown className="w-5 h-5 stroke-secondary-icon" />
            )}
          </div>
        </div>
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
          className={`absolute z-10 right-0 top-[42px] w-full ${className} bg-white rounded-lg shadow-lg border border-tertiary-stroke max-h-60 overflow-auto p-0 m-0 list-none`}
        >
          {formattedOptions.map((option, index) => {
            const isSelected = option.value === selectedValue;
            const isLast = index === formattedOptions.length - 1;
            return (
              <li
                id={`option-${option.value}`}
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleOptionClick(option)}
                onKeyDown={(e) => handleOptionKeyDown(e, option)}
                tabIndex={0}
                className={`px-4 py-2 text-tertiary-light text-sm font-normal font-['Inter'] leading-tight hover:bg-tertiary-space cursor-pointer ${
                  isSelected ? "bg-tertiary-space" : ""
                } ${!isLast ? "border-b border-tertiary-stroke" : ""}`}
              >
                {option.value}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
