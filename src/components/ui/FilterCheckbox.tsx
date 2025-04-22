import { Check } from "lucide-react";

/**
 * Props for the CustomCheckbox component
 */
interface FilterCheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  id: string;
  isEditing?: boolean;
  labelClassName?: string;
}

/**
 * CustomCheckbox component renders a styled checkbox with a label and optional editability
 */
const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
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
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-checked={checked}
        disabled={!isEditing}
        className={`absolute w-5 h-5 opacity-0 z-10 top-0 left-0 ${
          isEditing ? "cursor-pointer" : "cursor-default"
        }`}
      />
      <div
        className={`absolute top-0 left-0 w-5 h-5 border rounded flex items-center justify-center transition-colors ${
          checked
            ? "bg-white border-black"
            : "bg-white border-tertiary-blueTint"
        }`}
      >
        {checked && <Check size={16} className="text-black" />}
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

export default FilterCheckbox;
