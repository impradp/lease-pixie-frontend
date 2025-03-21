"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import PixieButton from "@/components/ui/buttons/PixieButton";

interface PreConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
}

const PreConfirmationDialog: React.FC<PreConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonLabel = "Create Billing Account",
  cancelButtonLabel = "Cancel",
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
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close dialog"
      />

      {/* Dialog Content */}
      <div className="w-[326px] h-[272px] px-8 py-[42px] relative bg-white rounded-2xl shadow-[20px_20px_20px_0px_rgba(0,0,0,0.08)] flex flex-col justify-center items-center gap-10 z-50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-6 h-6 absolute left-[270px] top-[12px] inline-flex justify-center items-center focus:outline-none"
          aria-label="Close dialog"
        >
          <X className="w-6 h-6 text-tertiary-light" />
        </button>

        {/* Content */}
        <div className="self-stretch flex flex-col justify-center items-center gap-6">
          <div className="self-stretch py-4 flex flex-col justify-center items-center gap-4">
            <div className="self-stretch text-center text-secondary-space text-base font-medium font-['Inter']">
              {title}
            </div>
            <div className="self-stretch text-center text-secondary-space text-sm font-normal font-['Inter']">
              {message}
            </div>
          </div>

          {/* Buttons */}
          <div className="self-stretch flex flex-col justify-start items-center gap-4">
            <PixieButton
              onClick={onConfirm}
              label={confirmButtonLabel}
              className="self-stretch px-3.5 py-2.5 bg-secondary-light rounded shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] outline outline-2 outline-offset-[-2px] outline-white outline-opacity-10 text-white text-sm font-semibold font-['Inter'] leading-tight"
            />
            <button
              onClick={onClose}
              className="self-stretch inline-flex justify-center items-center gap-1.5 text-tertiary-light text-sm font-semibold font-['Inter'] underline leading-tight"
            >
              {cancelButtonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreConfirmationDialog;
