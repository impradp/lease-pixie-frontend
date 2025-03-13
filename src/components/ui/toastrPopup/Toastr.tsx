import React, { useEffect, useRef, useState } from "react";
import { Check, Info, X } from "lucide-react";

interface ToastrProps {
  message: string;
  duration?: number;
  toastrType?: "success" | "info" | "warning";
  onClose?: () => void;
}

const Toastr: React.FC<ToastrProps> = ({
  message,
  duration = 3500,
  toastrType = "success",
  onClose,
}) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const toastrConfig = {
    success: {
      icon: (
        <Check height={20} width={20} className="text-tertiary-charcoalBlue" />
      ),
    },
    info: {
      icon: (
        <Info height={20} width={20} className="text-tertiary-charcoalBlue" />
      ),
    },
    warning: {
      icon: <X height={20} width={20} className="text-tertiary-charcoalBlue" />,
    },
    default: {
      icon: (
        <Check height={20} width={20} className="text-tertiary-charcoalBlue" />
      ),
    },
  };
  const { icon } = toastrConfig[toastrType] || toastrConfig.default;

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="w-96 h-[52px] bg-[#a5b3c9]/80 flex items-center justify-between p-2 relative overflow-hidden shadow-sm transition-opacity duration-300 animate-single-bounce"
      style={{
        marginBottom: "8px",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="flex items-center gap-2">
        {icon}
        <div className="h-3.5 justify-start text-[#0c111d] text-[13px] font-medium font-['Inter'] leading-[14px]">
          {message}
        </div>
      </div>
      <button
        onClick={handleClose}
        aria-label="Close notification"
        className="flex items-center w-4 h-4 text-tertiary-light hover:text-gray-600"
      >
        <X height={16} width={16} />
      </button>
      <div
        className="w-96 h-1 absolute bottom-0 left-0"
        style={{
          background: "linear-gradient(to right, #bc62ca, #e4984f)",
        }}
      />
      <div
        className="h-1 absolute bottom-0 right-0 bg-[#6887B4]"
        style={{
          width: "0%",
          animation: `fillWidth ${duration}ms linear forwards`,
        }}
      />
    </div>
  );
};

export default Toastr;
