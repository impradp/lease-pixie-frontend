import React, { useState, useRef, useEffect, useId } from "react";
import { ChevronRight, ListFilter } from "lucide-react";
import { DropdownOption } from "@/types/user";

/**
 * Props for the PixieDropdown component
 * @interface PixieDropdownProps
 * @property {string} [label] - Optional label text displayed above the dropdown
 * @property {DropdownOption[]} options - Array of options to display in the dropdown
 * @property {string} [value] - Currently selected value
 * @property {function} [onChange] - Callback function triggered when selection changes
 * @property {boolean} [readOnly=false] - Whether the dropdown can be interacted with
 * @property {boolean} isEditing - Whether the component is in edit mode
 * @property {boolean} [isLocked=false] - Whether the dropdown is locked (shows lockMessage)
 * @property {string} [lockMessage] - Message to display when dropdown is locked
 * @property {string} [className] - Additional CSS class for the dropdown
 * @property {string} [labelClassName] - Additional CSS class for the label
 * @property {string} [placeholder] - Text to display when no option is selected
 * @property {string} [containerClassName] - Additional CSS class for the container
 * @property {string} [customInputClassName] - Additional CSS class for the input field
 * @property {"large" | "default" | "small"} [type="small"] - Size variant of the dropdown
 */
interface PixieDropdownProps {
  label?: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  isEditing: boolean;
  isLocked?: boolean;
  lockMessage?: string;
  className?: string;
  labelClassName?: string;
  placeholder?: string;
  containerClassName?: string;
  customInputClassName?: string;
  type?: "large" | "default" | "small";
  showFilterIcon?: boolean;
  disabled?: boolean;
  isRequired?: boolean;
}

/**
 * A customizable dropdown component with different size variants and states
 *
 * @component
 * @param {PixieDropdownProps} props - Component props
 * @returns {React.ReactElement} Rendered dropdown component
 */
export const PixieDropdown: React.FC<PixieDropdownProps> = ({
  label = "",
  options,
  value = "",
  onChange,
  isEditing,
  lockMessage,
  isLocked = false,
  className,
  labelClassName,
  placeholder,
  containerClassName,
  customInputClassName,
  type = "small",
  showFilterIcon = false,
  disabled = false,
  isRequired = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLDivElement>(null); // New ref for the input field
  const inputId = useId();

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
      "w-full flex flex-col justify-start items-start gap-1.5";
    sizeCustomInputClassName =
      customInputClassName ??
      "h-11 px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-none text-tertiary-light text-base font-normal font-['Inter'] leading-normal";
    dropdownPosition = "top-[calc(100%+0.375rem)]";
    optionItemClassName = `py-2.5 text-tertiary-light text-base font-normal font-['Inter'] leading-normal ${
      isEditing ? "cursor-pointer" : ""
    }`;
  } else if (type === "default") {
    sizeClassName = className ?? "w-full xs:w-[200px]";
    sizeLabelClassName =
      labelClassName ?? "text-secondary-light text-sm font-bold leading-[20px]";
    sizeContainerClassName =
      containerClassName ?? "w-full h-[50px] gap-2 items-center";
    sizeCustomInputClassName = customInputClassName ?? "h-10";
    dropdownPosition = "top-[50px]";
    optionItemClassName = `py-2 text-tertiary-light text-sm font-normal font-['Inter'] leading-tight hover:bg-tertiary-space ${
      isEditing ? "cursor-pointer" : ""
    }`;
  } else {
    sizeClassName = className ?? "w-full xs:w-[153px]";
    sizeLabelClassName =
      labelClassName ?? "text-secondary-light text-xs font-bold leading-[18px]";
    sizeContainerClassName =
      containerClassName ?? "w-full h-[42px] gap-2 items-center";
    sizeCustomInputClassName = customInputClassName ?? "h-9";
    dropdownPosition = "top-[42px]";
    optionItemClassName = `py-2 text-tertiary-light text-sm font-normal font-['Inter'] leading-tight ${
      isEditing ? "cursor-pointer" : ""
    }`;
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
        label: placeholder ?? "Select option",
      };

  const handleClick = () => {
    if (isEditing) {
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isEditing) {
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

  // Dynamically set dropdown width to match input field width
  useEffect(() => {
    if (!listboxRef.current || !inputRef.current || !isOpen) return;

    const setDropdownWidth = () => {
      const inputWidth = inputRef.current!.offsetWidth;
      listboxRef.current!.style.width = `${inputWidth}px`;
    };

    const observer = new ResizeObserver(setDropdownWidth);
    observer.observe(inputRef.current);

    setDropdownWidth(); // Initial set

    return () => observer.disconnect();
  }, [isOpen]);

  return (
    <div
      className={`w-full justify-end ${sizeContainerClassName} inline-flex relative`}
      ref={dropdownRef}
    >
      {label && (
        <label
          className={`${sizeLabelClassName} font-['Inter'] ${
            disabled ? "opacity-50" : ""
          }`}
        >
          {label}
          {isRequired && (
            <span className="text-tertiary-muteBlueGray text-sm"> *</span>
          )}
        </label>
      )}
      <div
        className={`w-full ${sizeClassName} self-stretch justify-start items-center gap-2 flex`}
      >
        <div
          ref={inputRef} // Attach ref to the input div
          id={inputId}
          tabIndex={isEditing ? 0 : -1}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={`w-full grow shrink basis-0 px-3.5 py-2.5 bg-white rounded-lg border border-tertiary-stroke justify-start items-center gap-2 flex overflow-hidden ${sizeCustomInputClassName} ${
            isEditing && !isLocked ? "cursor-pointer" : ""
          }`}
          aria-label={label || "Dropdown selection"}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${inputId}-options`}
          aria-disabled={!isEditing}
        >
          <div
            className={`grow shrink basis-0 h-5 justify-between items-center flex`}
          >
            <div className="justify-start items-center gap-2 flex">
              <label
                className={`text-tertiary-light ${optionItemClassName} font-normal font-['Inter'] leading-tight`}
              >
                {selectedOption.label}
              </label>
            </div>
            {isEditing && !isLocked && !showFilterIcon && (
              <ChevronRight
                className={`w-4 h-4 text-tertiary-slateMist transition-transform duration-300 ${
                  isOpen && !isLocked ? "rotate-90" : ""
                }`}
              />
            )}
            {isEditing && !isLocked && showFilterIcon && (
              <ListFilter className="w-[20px] h-[20px] stroke-secondary-button" />
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
          className={`absolute z-10 right-0 ${dropdownPosition} w-full bg-white rounded-lg shadow-lg border border-tertiary-stroke max-h-60 overflow-auto p-0 m-0 list-none`}
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
                className={`${optionItemClassName} px-4 ${
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
