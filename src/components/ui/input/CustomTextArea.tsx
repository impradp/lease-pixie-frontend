import React from "react";

interface CustomTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  isEditing?: boolean;
  label: string;
  labelClassName?: string;
  containerClassName?: string;
}

export const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  value,
  onChange,
  readOnly = false,
  isEditing = false,
  label,
  labelClassName = "",
  containerClassName = "",
}) => {
  return (
    <div
      className={`inline-flex flex-col justify-start items-start gap-1.5 ${containerClassName}`}
    >
      <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
        <div className="inline-flex justify-start items-start gap-0.5">
          <div
            className={`justify-start text-tertiary-slateBlue text-sm font-medium font-['Inter'] leading-tight ${labelClassName}`}
          >
            {label}
          </div>
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly || !isEditing} // Only editable when isEditing is true and readOnly is false
          className={`px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-tertiary-stroke w-full text-card-input-regular text-base font-normal font-['Inter'] leading-normal resize-none h-[116px] ${
            isEditing && !readOnly ? "cursor-text" : "cursor-default"
          }`}
          disabled={!isEditing || readOnly}
        />
      </div>
    </div>
  );
};

export default CustomTextArea;
