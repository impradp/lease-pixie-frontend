"use client";

import { useState } from "react";
import { X } from "lucide-react";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { CustomCheckbox } from "@/components/ui/input/CustomCheckbox";

/**
 * Props for the ConsentForm component.
 *
 * @interface ConsentFormProps
 * @property {string} label - Main title of the form displayed at the top.
 * @property {string} consentLabel - Text displayed next to the consent checkbox.
 * @property {(agreed: boolean) => void} onSubmit - Callback function triggered when the form is submitted with agreement.
 * @property {() => void} [onClose] - Optional callback function triggered when the close button is clicked.
 * @property {string} [className] - Optional additional CSS classes for styling the form container.
 * @property {React.CSSProperties} [style] - Optional inline CSS styles for the form container.
 */
interface ConsentFormProps {
  label: string;
  consentLabel: string;
  onSubmit: (agreed: boolean) => void;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ConsentForm component.
 *
 * @param {ConsentFormProps} props - The props for the ConsentForm component.
 * @returns {JSX.Element} The rendered consent form component.
 */
function ConsentForm({
  label,
  consentLabel,
  onSubmit,
  onClose,
  className = "",
  style,
}: ConsentFormProps) {
  const [agreed, setAgreed] = useState(false);

  /**
   * Handles form submission, preventing submission if the user has not agreed.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreed) return;
    onSubmit(agreed);
  };

  /**
   * Handles the close button click, resetting the agreement state and calling the onClose callback if provided.
   */
  const handleClose = () => {
    setAgreed(false);
    if (onClose) onClose();
  };

  return (
    <div
      className={`w-full min-h-[264px] min-w-[358px] bg-[#fcfcfc] rounded-xl shadow-lg flex flex-col items-start p-8 absolute z-50 ${className}`}
      style={style}
    >
      {/* Close Button */}
      <div className="w-full relative mb-6">
        {onClose && (
          <button
            onClick={handleClose}
            className="w-6 h-6 inline-flex justify-center items-center focus:outline-none absolute top-0 right-0"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        )}
      </div>

      {/* Title */}
      <div className="w-full relative mb-6">
        <div className="text-[#0f1728] text-xl font-semibold font-['Inter'] text-center w-full">
          {label}
        </div>
      </div>

      {/* Consent Checkbox */}
      <div className="w-full relative mb-6">
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <CustomCheckbox
            id="consent-checkbox"
            checked={agreed}
            onChange={setAgreed}
            label={consentLabel}
            isEditing={true}
            labelClassName="text-[#344053] text-xs font-medium"
          />
        </div>
      </div>

      {/* Form with Button */}
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col justify-center items-center gap-4"
      >
        <PixieButton
          label="I Agree"
          type="submit"
          disabled={!agreed}
          className="bg-black text-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-inner border-2 border-white/10 w-full"
        />
      </form>
    </div>
  );
}

export default ConsentForm;
