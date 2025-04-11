import React, { useState } from "react";

/**
 * Props for the CustomInput component
 */
interface CustomInputProps {
  label?: string; // Input label
  value: string; // Input value
  onChange?: (value: string) => void; // Callback for value changes
  readOnly?: boolean; // Whether the input is read-only
  isEditing?: boolean; // Whether the input is in editing mode
  placeholder?: string; // Placeholder text
  containerClassName?: string; // Custom class for the container
  className?: string; // Custom class for the input
  labelClassName?: string; // Custom class for the label
  type?: "text" | "email" | "mobile"; // Input type
  error?: string; // External error message
  disabled?: boolean; // Whether the input is disabled
  isRequired?: boolean; // Whether the input is required
}

/**
 * Renders a customizable input field with validation for email and mobile types
 * @param props - The properties for configuring the input
 * @returns JSX.Element - The rendered custom input
 */
const CustomInput: React.FC<CustomInputProps> = ({
  label = "",
  value = "",
  onChange,
  readOnly = false,
  isEditing = false,
  placeholder = "",
  containerClassName = "",
  className = "py-2.5 text-base text-tertiary-light",
  labelClassName = "text-secondary-light text-sm font-medium",
  type = "text",
  error: externalError,
  disabled = false,
  isRequired = false,
}) => {
  const [internalError, setInternalError] = useState<string | null>(null); // State for internal validation errors

  /**
   * Validates an email address
   * @param email - The email string to validate
   * @returns boolean - Whether the email is valid
   */
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Formats a mobile number into XXX-XXX-XXXX format
   * @param input - The raw input string
   * @returns string - The formatted mobile number
   */
  const formatMobile = (input: string) => {
    const numbers = input.replace(/[^0-9]/g, "");
    if (numbers.length === 0) return "";
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(
      6,
      10
    )}`;
  };

  /**
   * Validates a mobile number in XXX-XXX-XXXX format
   * @param mobile - The mobile string to validate
   * @returns boolean - Whether the mobile number is valid
   */
  const validateMobile = (mobile: string) => {
    const mobileRegex = /^\d{3}-\d{3}-\d{4}$/;
    return mobileRegex.test(mobile);
  };

  /**
   * Handles input value changes with mobile formatting
   * @param e - The input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing || readOnly || disabled) return;

    let newValue = e.target.value;
    if (type === "mobile") {
      const numbersOnly = newValue.replace(/[^0-9]/g, "");
      if (numbersOnly.length > 10) return;
      newValue = formatMobile(newValue);
    }
    onChange?.(newValue);
  };

  /**
   * Restricts key presses for mobile input to numbers and navigation keys
   * @param e - The keydown event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (type === "mobile") {
      const char = e.key;
      if (
        !/[0-9]/.test(char) &&
        !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(
          char
        ) &&
        !(e.ctrlKey && char === "v") &&
        !(e.metaKey && char === "v")
      ) {
        e.preventDefault();
      }
    }
  };

  /**
   * Handles pasted text for mobile input
   * @param e - The paste event
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (!isEditing || readOnly || disabled) return;

    if (type === "mobile") {
      const pastedText = e.clipboardData.getData("text");
      const numbersOnly = pastedText.replace(/[^0-9]/g, "");
      if (numbersOnly.length > 10) return;
      const formattedValue = formatMobile(numbersOnly);
      onChange?.(formattedValue);
      validateInput(formattedValue);
    }
  };

  /**
   * Validates the input value based on type
   * @param inputValue - The value to validate
   */
  const validateInput = (inputValue: string) => {
    if (type === "email" && inputValue) {
      setInternalError(
        validateEmail(inputValue) ? null : "Invalid email format"
      );
    } else if (type === "mobile" && inputValue) {
      setInternalError(
        validateMobile(inputValue) || inputValue.length === 0
          ? null
          : "Invalid mobile format"
      );
    } else {
      setInternalError(null);
    }
  };

  const displayError = externalError ?? internalError;

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      <label
        className={`${labelClassName} font-['Inter'] leading-tight ${
          disabled ? "opacity-50" : ""
        }`}
      >
        {label}
        {isRequired && <span className="text-[#878aa4] text-sm"> *</span>}
      </label>
      <div
        className={`px-3.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)_inset] outline outline-1 outline-offset-[-1px] outline-tertiary-stroke flex items-center ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <input
          placeholder={type === "mobile" ? "800-555-1234" : placeholder}
          type={type === "mobile" ? "tel" : type}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          readOnly={!isEditing || readOnly}
          disabled={disabled}
          className={`w-full ${className} font-normal font-['Inter'] leading-normal outline-none bg-transparent placeholder:text-tertiary-slateMist ${
            disabled ? "cursor-not-allowed" : ""
          }`}
        />
      </div>
      {displayError && <span className="input-error">{displayError}</span>}
    </div>
  );
};

export default CustomInput;
