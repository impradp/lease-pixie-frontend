import React, { useState } from "react";

interface CustomInputProps {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  isEditing?: boolean;
  placeholder?: string;
  containerClassName?: string;
  className?: string;
  labelClassName?: string;
  type?: "text" | "email" | "mobile";
  error?: string;
  disabled?: boolean; // Added disabled prop
}

const CustomInput: React.FC<CustomInputProps> = ({
  label = "",
  value,
  onChange,
  readOnly = false,
  isEditing = false,
  placeholder = "",
  containerClassName = "",
  className = "py-2.5 text-base text-tertiary-light",
  labelClassName = "text-secondary-light text-sm font-medium",
  type = "text",
  error: externalError,
  disabled = false, // Default to false
}) => {
  const [internalError, setInternalError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

  const validateMobile = (mobile: string) => {
    const mobileRegex = /^\d{3}-\d{3}-\d{4}$/;
    return mobileRegex.test(mobile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing || readOnly || disabled) return;

    let newValue = e.target.value;

    if (type === "mobile") {
      const numbersOnly = newValue.replace(/[^0-9]/g, "");
      if (numbersOnly.length > 10) return;
      newValue = formatMobile(newValue);
    }

    onChange?.(newValue);
    validateInput(newValue);
  };

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

  const displayError = externalError || internalError;

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      <label
        className={`${labelClassName} font-['Inter'] leading-tight ${
          disabled ? "opacity-50" : ""
        }`}
      >
        {label}
      </label>
      <div
        className={`px-3.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-tertiary-stroke flex items-center ${
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
          disabled={disabled} // Native HTML disabled attribute
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
