import React from "react";

interface CustomInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  isEditing: boolean;
  placeholder?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChange,
  readOnly = false,
  isEditing = false,
  placeholder = "",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing || readOnly) return; // Prevent onChange when readOnly or not editing
    onChange?.(e.target.value);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[#344053] text-sm font-medium font-['Inter'] leading-tight">
        {label}
      </label>
      <div className="px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border border-[#cfd4dc] flex items-center">
        <input
          placeholder={placeholder}
          type="text"
          value={value}
          onChange={handleChange}
          readOnly={!isEditing || readOnly}
          className="w-full text-[#0f1728] text-base font-normal font-['Inter'] leading-normal outline-none bg-transparent"
        />
      </div>
    </div>
  );
};
