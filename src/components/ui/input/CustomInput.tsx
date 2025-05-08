import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeClosed } from "lucide-react";

/**
 * Props for the CustomInput component
 */
interface CustomInputProps {
  maxCharLength?: number;
  label?: string; // Input label
  value: string; // Input value
  onChange?: (value: string) => void; // Callback for value changes
  readOnly?: boolean; // Whether the input is read-only
  isEditing?: boolean; // Whether the input is in editing mode
  placeholder?: string; // Placeholder text
  containerClassName?: string; // Custom class for the container
  className?: string; // Custom class for the input
  labelClassName?: string; // Custom class for the label
  type?: "text" | "email" | "mobile" | "money" | "number" | "password"; // Input type
  error?: string; // External error message
  disabled?: boolean; // Whether the input is disabled
  isRequired?: boolean; // Whether the input is required
}

/**
 * Renders a customizable input field with validation for email, mobile, money, and number types
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
  maxCharLength,
}) => {
  const [internalError, setInternalError] = useState<string | null>(null); // State for internal validation errors
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const inputRef = useRef<HTMLInputElement>(null);

  // Format initial value for mobile type
  useEffect(() => {
    if (type === "mobile" && value && !value.includes("-")) {
      // Format the initial value with hyphens if it doesn't have them
      const formattedValue = formatMobile(value);
      if (formattedValue !== value) {
        onChange?.(formattedValue);
      }
    }
  }, []);

  // Convert value to display format for money type
  const getDisplayValue = () => {
    if (type === "money") {
      return value ? `$${value}` : "$";
    }
    return value;
  };

  // Handle focus for money type
  const handleFocus = () => {
    if (type === "money" && inputRef.current) {
      // Place cursor at the end of input
      const valueLength = inputRef.current.value.length;
      inputRef.current.setSelectionRange(valueLength, valueLength);
    }
  };

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
   * Handles input value changes with formatting for various types
   * @param e - The input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing || readOnly || disabled) return;

    let newValue = e.target.value;

    if (type === "mobile") {
      const numbersOnly = newValue.replace(/[^0-9]/g, "");
      if (numbersOnly.length > 10) return;
      newValue = formatMobile(newValue);
      onChange?.(newValue);
    } else if (type === "money") {
      // Remove the dollar sign for processing
      if (newValue.startsWith("$")) {
        newValue = newValue.substring(1);
      } else {
        // If user somehow deleted the dollar sign, ignore this change
        return;
      }

      // Only allow numbers and decimal point
      if (!/^[0-9]*\.?[0-9]*$/.test(newValue)) return;

      // Pass the value without $ to parent
      onChange?.(newValue);
    } else if (type === "number") {
      // Only allow numbers and decimal point for number type
      if (!/^[0-9]*\.?[0-9]*$/.test(newValue)) return;

      onChange?.(newValue);
    } else {
      onChange?.(newValue);
    }
  };

  /**
   * Restricts key presses for various input types
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
    } else if (type === "money") {
      const char = e.key;

      // Allow only numbers, decimal point, and navigation keys
      if (
        !/[0-9.]/.test(char) &&
        !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(
          char
        ) &&
        !(e.ctrlKey && char === "v") &&
        !(e.metaKey && char === "v")
      ) {
        e.preventDefault();
      }

      // Prevent deleting the dollar sign
      if (
        (char === "Backspace" || char === "Delete") &&
        inputRef.current?.selectionStart === 1 &&
        inputRef.current?.selectionEnd === 1
      ) {
        e.preventDefault();
      }

      // Prevent multiple decimal points
      if (char === "." && value.includes(".")) {
        e.preventDefault();
      }
    } else if (type === "number") {
      const char = e.key;

      // Allow only numbers, decimal point, and navigation keys
      if (
        !/[0-9.]/.test(char) &&
        !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(
          char
        ) &&
        !(e.ctrlKey && char === "v") &&
        !(e.metaKey && char === "v")
      ) {
        e.preventDefault();
      }

      // Prevent multiple decimal points
      if (char === "." && value.includes(".")) {
        e.preventDefault();
      }
    }
  };

  /**
   * Handles click for money type to prevent selecting the dollar sign
   */
  const handleClick = () => {
    if (type === "money" && inputRef.current) {
      if (inputRef.current.selectionStart === 0) {
        // If cursor is before the $ sign, move it after
        inputRef.current.setSelectionRange(1, 1);
      }
    }
  };

  /**
   * Handles selection for money type to prevent selecting the dollar sign
   */
  const handleSelect = () => {
    if (type === "money" && inputRef.current) {
      const { selectionStart } = inputRef.current;
      if (selectionStart === 0) {
        // If selection includes $ sign, adjust it
        inputRef.current.setSelectionRange(
          1,
          inputRef.current.selectionEnd || 1
        );
      }
    }
  };

  /**
   * Handles pasted text for various input types
   * @param e - The paste event
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (!isEditing || readOnly || disabled) return;

    const pastedText = e.clipboardData.getData("text");

    if (type === "mobile") {
      const numbersOnly = pastedText.replace(/[^0-9]/g, "");
      if (numbersOnly.length > 10) return;
      const formattedValue = formatMobile(numbersOnly);
      onChange?.(formattedValue);
      validateInput(formattedValue);
      e.preventDefault();
    } else if (type === "money") {
      // Remove any $ signs from pasted value
      const cleanValue = pastedText.replace(/[$,]/g, "");

      // Only allow numbers and at most one decimal point
      if (!/^[0-9]*\.?[0-9]*$/.test(cleanValue)) {
        e.preventDefault();
        return;
      }

      onChange?.(cleanValue);
      e.preventDefault();
    } else if (type === "number") {
      // Only allow numbers and decimal point for number type
      const cleanValue = pastedText.replace(/[^0-9.]/g, "");

      // Ensure only one decimal point
      const parts = cleanValue.split(".");
      let validValue = parts[0];
      if (parts.length > 1) {
        validValue += "." + parts[1];
      }

      onChange?.(validValue);
      e.preventDefault();
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

  // Ensure cursor position is maintained after $ sign for money type
  useEffect(() => {
    if (
      type === "money" &&
      inputRef.current &&
      document.activeElement === inputRef.current
    ) {
      // When value changes, ensure cursor position is after the $ sign
      const cursorPos = inputRef.current.selectionStart || 0;
      if (cursorPos === 0) {
        inputRef.current.setSelectionRange(1, 1);
      }
    }
  }, [value, type]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    if (!disabled && isEditing && !readOnly) {
      setShowPassword(!showPassword);
    }
  };

  const displayError = externalError ?? internalError;

  // Determine the appropriate input type attribute
  const getInputTypeAttribute = () => {
    if (type === "mobile") return "tel";
    if (type === "money" || type === "number") return "text"; // Using text for better control
    if (type === "password") return showPassword ? "text" : "password";
    return type;
  };

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
          ref={inputRef}
          placeholder={
            type === "mobile"
              ? "800-555-1234"
              : type === "money"
              ? "$"
              : type === "number"
              ? ""
              : placeholder
          }
          type={getInputTypeAttribute()}
          value={getDisplayValue()}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={handleFocus}
          onClick={handleClick}
          onSelect={handleSelect}
          readOnly={!isEditing || readOnly}
          disabled={disabled}
          maxLength={maxCharLength || undefined}
          className={`flex-1 ${className} font-normal font-['Inter'] leading-normal outline-none bg-transparent placeholder:text-tertiary-slateMist ${
            disabled ? "cursor-not-allowed" : ""
          }`}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={`ml-2 p-1 ${
              disabled || !isEditing || readOnly
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
            disabled={disabled || !isEditing || readOnly}
          >
            {showPassword ? (
              <Eye className="h-4 w-4 text-gray-500" />
            ) : (
              <EyeClosed className="h-4 w-4 text-gray-500" />
            )}
          </button>
        )}
      </div>
      {displayError && <span className="input-error">{displayError}</span>}
    </div>
  );
};

export default CustomInput;
