import React, { useState, useRef, useEffect, useId } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownOption {
  value: string;
  label: string;
}

interface PixieDropdownProps {
  label?: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  isEditing: boolean;
  isLocked?: boolean;
  lockMessage?: string;
  className?: string;
  labelClassName?: string;
  placeholder?: string;
  containerClassName?: string;
  customInputClassName?: string;
  type?: "large" | "default" | "small";
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
  className,
  labelClassName,
  placeholder,
  containerClassName,
  customInputClassName,
  type = "small",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const inputId = useId();

  // Define size-based styling
  let sizeClassName: string;
  let sizeLabelClassName: string;
  let sizeContainerClassName: string;
  let sizeCustomInputClassName: string;
  let dropdownPosition: string;
  let optionItemClassName: string;

  if (type === "large") {
    sizeClassName = className ?? "self-stretch";
    sizeLabelClassName =
      labelClassName ??
      "justify-start text-tertiary-slateBlue text-sm font-medium font-['Inter'] leading-tight";
    sizeContainerClassName =
      containerClassName ??
      "self-stretch flex flex-col justify-start items-start gap-1.5";
    sizeCustomInputClassName =
      customInputClassName ??
      "h-11 px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]  outline-none text-tertiary-light text-base font-normal font-['Inter'] leading-normal";
    dropdownPosition = "top-[calc(100%+0.375rem)]";
    optionItemClassName =
      "py-2.5 text-tertiary-light text-base font-normal font-['Inter'] leading-normal cursor-pointer"; // Matches input text size and height
  } else if (type === "default") {
    sizeClassName = className ?? "xs:w-[200px]";
    sizeLabelClassName =
      labelClassName ?? "text-secondary-light text-sm font-bold leading-[20px]";
    sizeContainerClassName =
      containerClassName ?? "xs:w-[500px] h-[50px] gap-2 items-center";
    sizeCustomInputClassName = customInputClassName ?? "h-10";
    dropdownPosition = "top-[50px]";
    optionItemClassName =
      "py-2 text-tertiary-light text-sm font-normal font-['Inter'] leading-tight hover:bg-tertiary-space cursor-pointer"; // Default for other sizes
  } else {
    // "small" - uses original defaults
    sizeClassName = className ?? "xs:w-[153px]";
    sizeLabelClassName =
      labelClassName ?? "text-secondary-light text-xs font-bold leading-[18px]";
    sizeContainerClassName =
      containerClassName ?? "xs:w-[460px] h-[42px] gap-2 items-center";
    sizeCustomInputClassName = customInputClassName ?? "h-9";
    dropdownPosition = "top-[42px]";
    optionItemClassName =
      " py-2 text-tertiary-light text-sm font-normal font-['Inter'] leading-tight cursor-pointer"; // Default for small
  }

  const formattedOptions: DropdownOption[] = options.map((opt) =>
    typeof opt === "object" && "value" in opt && "label" in opt
      ? opt
      : { value: String(opt), label: String(opt) }
  );

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const selectedOption = isLocked
    ? { label: lockMessage ?? "Locked", value: "" }
    : formattedOptions.find((option) => option.value === selectedValue) || {
        value: "",
        label: placeholder || "Select option",
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
      onChange(option.value);
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
      className={`w-full justify-end ${sizeContainerClassName} inline-flex relative`}
      ref={dropdownRef}
    >
      {label && (
        <div className={`${sizeLabelClassName} font-['Inter']`}>{label}</div>
      )}
      <div
        className={`w-full ${sizeClassName} self-stretch justify-start items-center gap-2 flex`}
      >
        <div
          id={inputId}
          tabIndex={!readOnly && isEditing ? 0 : -1}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={`w-full grow shrink basis-0 px-3.5 py-2.5 bg-white rounded-lg border border-tertiary-stroke justify-start items-center gap-2 flex overflow-hidden ${sizeCustomInputClassName} ${
            isEditing && !isLocked ? "cursor-pointer" : "cursor-default"
          }`}
          aria-label={label || "Dropdown selection"}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${inputId}-options`}
          aria-disabled={readOnly}
        >
          <div
            className={`grow shrink basis-0 h-5 justify-between items-center flex`}
          >
            <div className="justify-start items-center gap-2 flex">
              <div
                className={`text-tertiary-light ${optionItemClassName} font-normal font-['Inter'] leading-tight`}
              >
                {selectedOption.label}
              </div>
            </div>
            {isEditing && !readOnly && !isLocked && (
              <ChevronDown
                className="w-5 h-5 stroke-secondary-icon"
                aria-hidden="true"
              />
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
          className={`absolute z-10 right-0 ${dropdownPosition} w-full ${sizeClassName} bg-white rounded-lg shadow-lg border border-tertiary-stroke max-h-60 overflow-auto p-0 m-0 list-none`}
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
                className={`${optionItemClassName} px-4  ${
                  isSelected ? "bg-tertiary-space" : ""
                } ${!isLast ? "border-b border-tertiary-stroke" : ""}`}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
