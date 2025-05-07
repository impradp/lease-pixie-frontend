import React, { useState, useRef } from "react";
import { Expand } from "lucide-react";
import PixieButton from "../buttons/PixieButton";

/**
 * Props for the PixieTextArea component
 */
interface PixieTextAreaProps {
  label?: string; // Input label
  value: string; // Input value
  onChange?: (value: string) => void; // Callback for value changes
  readOnly?: boolean; // Whether the input is read-only
  isEditing?: boolean; // Whether the input is in editing mode
  placeholder?: string; // Placeholder text
  containerClassName?: string; // Custom class for the container
  className?: string; // Custom class for the textarea
  labelClassName?: string; // Custom class for the label
  error?: string; // External error message
  disabled?: boolean; // Whether the input is disabled
  isRequired?: boolean; // Whether the input is required
  rows?: number; // Number of visible text lines
  maxLength?: number; // Maximum length of the input
}

/**
 * Renders a customizable textarea field with expand/collapse functionality
 * @param props - The properties for configuring the textarea
 * @returns JSX.Element - The rendered custom textarea
 */
const PixieTextArea: React.FC<PixieTextAreaProps> = ({
  label = "",
  value = "",
  onChange,
  readOnly = false,
  isEditing = false,
  placeholder = "",
  containerClassName = "",
  className = "py-2.5 text-base text-tertiary-light",
  labelClassName = "text-secondary-light text-sm font-medium",
  error,
  disabled = false,
  isRequired = false,
  rows = 4,
  maxLength,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Open the modal dialog and store the current value
  const handleExpand = () => {
    setTempValue(value); // Set temporary value to current value
    setShowModal(true);
    // Disable body scrolling when modal is open
    document.body.style.overflow = "hidden";
  };

  // Handle main textarea change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isEditing || readOnly || disabled) return;
    onChange?.(e.target.value);
  };

  // Handle modal textarea change
  const handleModalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isEditing || readOnly || disabled) return;
    setTempValue(e.target.value);
  };

  // Save changes from modal
  const handleSave = () => {
    if (onChange) {
      onChange(tempValue); // Apply the temporary value to the actual value
    }
    setShowModal(false);
    // Re-enable body scrolling when modal is closed
    document.body.style.overflow = "auto";
  };

  // Cancel changes from modal
  const handleCancel = () => {
    setTempValue(value); // Reset temp value to the original value
    setShowModal(false);
    // Re-enable body scrolling when modal is closed
    document.body.style.overflow = "auto";
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
        className={`pl-3.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)_inset] outline outline-1 outline-offset-[-1px] outline-tertiary-stroke flex flex-col relative ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <textarea
          ref={textareaRef}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          readOnly={!isEditing || readOnly}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={`flex-1 ${className} font-normal font-['Inter'] leading-normal outline-none bg-transparent resize-none placeholder:text-tertiary-slateMist ${
            disabled ? "cursor-not-allowed" : ""
          }`}
        />
        {!disabled && !readOnly && isEditing && (
          <button
            type="button"
            onClick={handleExpand}
            className="absolute bottom-1 right-2 pr-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Expand"
          >
            <Expand className="h-4 w-4" />
          </button>
        )}
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-4/5 max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{label || "Edit Text"}</h3>
            </div>
            <textarea
              value={tempValue}
              onChange={handleModalChange}
              readOnly={!isEditing || readOnly}
              disabled={disabled}
              rows={15}
              maxLength={maxLength}
              className="w-full px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)_inset] outline outline-1 outline-offset-[-1px] outline-tertiary-stroke font-normal font-['Inter'] text-base text-tertiary-light leading-normal resize-none placeholder:text-tertiary-slateMist"
              placeholder={placeholder}
            />
            <div className="flex justify-end mt-4 gap-2">
              <PixieButton
                label="Cancel"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 hover:bg-gray-500"
              />
              <PixieButton label="Save" onClick={handleSave} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PixieTextArea;
