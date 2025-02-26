import React, { useEffect } from "react";
import { X } from "lucide-react";
import PixieButton from "@/components/buttons/PixieButton";

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
      // Get the current scrollbar width before hiding it
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" aria-label="Close dialog" />
      <div className="w-[262px] relative z-50 bg-white rounded-2xl shadow-lg border border-black/10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer text-card-open-icon"
          aria-label="Close dialog"
        >
          <X size={24} strokeWidth={2} />
        </button>

        <div className="flex flex-col items-center pt-14 pb-6 px-8">
          <div className="w-full flex flex-col items-center gap-4 mb-6">
            <h3 className="text-card-open-regular text-base font-medium font-['Inter']">
              {title}
            </h3>
            <p className="text-card-open-regular text-sm font-normal font-['Inter'] text-center">
              {message}
            </p>
          </div>

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
