/**
 * CustomRadio Component
 *
 * A reusable radio button component with a styled appearance and optional editability.
 * Uses a custom dot to indicate selection and supports accessibility features.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.checked - Indicates whether the radio button is checked
 * @param {Function} props.onChange - Callback function triggered when the radio button state changes
 * @param {string} props.label - Text displayed next to the radio button
 * @param {string} props.id - Unique identifier for the radio input element
 * @param {boolean} [props.isEditing=false] - Flag to enable or disable editing of the radio button
 * @param {string} [props.labelClassName="text-tertiary-slateBlue text-sm font-medium"] - CSS classes for styling the label
 *
 * @example
 * ```tsx
 * <CustomRadio
 *   id="radio-1"
 *   checked={true}
 *   onChange={(value) => console.log(value)}
 *   label="Option 1"
 *   isEditing={true}
 * />
 * ```
 */

import React from "react";

interface CustomRadioProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  id: string;
  isEditing?: boolean;
  labelClassName?: string;
}

const CustomRadio: React.FC<CustomRadioProps> = ({
  checked,
  onChange,
  label,
  id,
  isEditing = false,
  labelClassName = "text-tertiary-slateBlue text-sm font-medium",
}) => (
  <div className="flex items-center space-x-2 gap-1">
    <div className="relative w-5 h-5 flex-shrink-0">
      <input
        type="radio"
        id={id}
        checked={checked}
        onChange={() => onChange(true)}
        aria-checked={checked}
        disabled={!isEditing}
        className={`absolute w-5 h-5 opacity-0 z-10 top-0 left-0 ${
          isEditing ? "cursor-pointer" : "cursor-default"
        }`}
      />
      <div
        className={`absolute top-0 left-0 w-5 h-5 border rounded-full flex items-center justify-center transition-colors ${
          checked
            ? "bg-white border-black"
            : "bg-white border-tertiary-blueTint"
        }`}
      >
        {checked && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
      </div>
    </div>
    <label
      htmlFor={id}
      className={`${labelClassName} font-['Inter'] leading-tight select-none ${
        isEditing ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {label}
    </label>
  </div>
);

export default CustomRadio;
