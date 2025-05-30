/**
 * A reusable confirmation dialog component that displays a title, message, and optional numbered points.
 * Supports closing via button or close icon, with overlay and scroll locking when open.
 * Numbered points are expected to be preformatted with "1)", "2)", etc.
 * @param props - Component props
 * @param props.isOpen - Whether the dialog is open
 * @param props.onClose - Callback to close the dialog
 * @param props.title - Dialog title
 * @param props.message - Main dialog message
 * @param props.bulletPoints - Optional array of numbered point strings to display
 * @param props.buttonLabel - Label for the close button (defaults to "Close")
 * @returns JSX.Element | null - The rendered dialog or null if not open
 */
import React, { useEffect } from "react";
import { X } from "lucide-react";
import PixieButton from "@/components/ui/buttons/PixieButton";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  bulletPoints?: string[];
  buttonLabel?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  bulletPoints,
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
      <div className="w-[275px] relative z-50 bg-white rounded-2xl shadow-lg border border-black/10">
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
            {/* Render numbered points only if provided and non-empty */}
            {bulletPoints && bulletPoints.length > 0 && (
              <ul className="text-card-open-regular text-sm font-normal font-['Inter'] text-left list-none">
                {bulletPoints.map((point, index) => (
                  <li key={index} className="pl-2">
                    {point}
                  </li>
                ))}
              </ul>
            )}
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
