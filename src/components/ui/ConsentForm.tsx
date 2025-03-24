"use client";

import { useState } from "react";
import { X } from "lucide-react";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { CustomCheckbox } from "@/components/ui/input/CustomCheckbox";

interface ConsentFormProps {
  label: string; // Main title of the form
  consentLabel: string; // Text for the consent checkbox
  onSubmit: (agreed: boolean) => void; // Callback when "I Agree" is clicked
  onClose?: () => void; // Optional close callback
  className?: string;
  style?: React.CSSProperties;
}

function ConsentForm({
  label,
  consentLabel,
  onSubmit,
  onClose,
  className = "",
  style,
}: ConsentFormProps) {
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreed) return; // Prevent submission if not agreed
    onSubmit(agreed);
  };

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
