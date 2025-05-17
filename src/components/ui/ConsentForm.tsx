"use client";

import { useState } from "react";
import { X } from "lucide-react";

import PixieButton from "@/components/ui/buttons/PixieButton";
import { CustomCheckbox } from "@/components/ui/input/CustomCheckbox";

/**
 * Props for the ConsentForm component
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
 * Renders a consent form with a checkbox and a submit button
 *
 * @param param0 - Component props
 * @returns The rendered consent form
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreed) return;
    onSubmit(agreed);
  };

  // Handle close button click
  const handleClose = () => {
    setAgreed(false);
    if (onClose) onClose();
  };

  return (
    <div
      className={`w-full max-w-[358px] min-w-[280px] h-[304px] p-8 bg-white rounded-xl shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05),0px_1px_4px_0px_rgba(12,12,13,0.10)] outline outline-1 outline-offset-[-1px] outline-secondary-light flex flex-col items-end gap-2.5 absolute z-50 ${className}`}
      style={style}
    >
      <div className="w-6 h-6 relative overflow-hidden">
        {onClose ? (
          <button
            onClick={handleClose}
            className="w-6 h-6 inline-flex justify-center items-center focus:outline-none absolute top-0 right-0"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-tertiary-light" />
          </button>
        ) : (
          <div className="w-3 h-3 left-[6px] top-[6px] absolute outline outline-2 outline-offset-[-1px] outline-tertiary-light" />
        )}
      </div>

      <div className="w-full">
        <div className="text-tertiary-deepNavy text-sm font-bold font-['Inter'] text-center leading-[30px]">
          {label}
        </div>
      </div>

      <div className="w-full pt-1 pb-4 flex-1">
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <CustomCheckbox
            id="consent-checkbox"
            checked={agreed}
            onChange={setAgreed}
            label={consentLabel}
            isEditing={true}
            labelClassName="text-tertiary-slateBlue w-[212px] text-xs font-medium font-['Inter'] leading-[18px]"
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col justify-center items-center gap-4"
      >
        <PixieButton
          label="I Agree"
          type="submit"
          disabled={!agreed}
          className="w-[294px] px-3.5 py-2.5 bg-black text-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05),inset_0px_-2px_0px_0px_rgba(16,24,40,0.05),inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] outline outline-2 outline-offset-[-2px] outline-white/10"
        />
      </form>
    </div>
  );
}

export default ConsentForm;
