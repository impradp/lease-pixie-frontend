import React, { useEffect } from "react";
import { X } from "lucide-react";
import PixieButton from "../buttons/PixieButton";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonLabel?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  buttonLabel = "Close",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="w-[262px] relative z-50 bg-white rounded-2xl shadow-[20px_20px_20px_0px_rgba(0,0,0,0.08)] border border-black/10">
        {/* X Icon Button - Positioned absolutely */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer"
        >
          <X size={24} className="text-[#475467]" strokeWidth={2} />
        </button>

        {/* Content Container */}
        <div className="flex flex-col items-center pt-14 pb-6 px-8">
          {/* Text Content */}
          <div className="w-full flex flex-col items-center gap-4 mb-6">
            <h3 className="text-[#101828] text-base font-medium font-['Inter']">
              {title}
            </h3>
            <p className="text-[#101828] text-sm font-normal font-['Inter'] text-center">
              {message}
            </p>
          </div>

          {/* Button */}
          <PixieButton
            onClick={onClose}
            label={buttonLabel}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
