import React from "react";

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
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label = "",
  value,
  onChange,
  readOnly = false,
  isEditing = false,
  placeholder = "",
  containerClassName = "",
  className = "py-2.5 text-base text-tertiary-light",
  labelClassName = "text-secondary-light text-sm font-medium",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing || readOnly) return;
    onChange?.(e.target.value);
  };

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      <label className={`${labelClassName} font-['Inter'] leading-tight`}>
        {label}
      </label>
      <div
        className={`px-3.5  bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-tertiary-stroke flex items-center`}
      >
        <input
          placeholder={placeholder}
          type="text"
          value={value}
          onChange={handleChange}
          readOnly={!isEditing || readOnly}
          className={`w-full ${className} font-normal font-['Inter'] leading-normal outline-none bg-transparent placeholder:text-tertiary-slateMist`}
        />
      </div>
    </div>
  );
};
