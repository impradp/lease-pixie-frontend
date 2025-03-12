import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Check, Info, X } from "lucide-react";

// Define the props interface
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

  // Memoize toastr icon based on toastrType
  const toastrConfig = useMemo(() => {
    const config = {
      success: {
        icon: (
          <Check
            height={20}
            width={20}
            className="text-tertiary-charcoalBlue"
          />
        ),
      },
      info: {
        icon: (
          <Info height={20} width={20} className="text-tertiary-charcoalBlue" />
        ),
      },
      warning: {
        icon: (
          <X height={20} width={20} className="text-tertiary-charcoalBlue" />
        ),
      },
      default: {
        icon: (
          <Check
            height={20}
            width={20}
            className="text-tertiary-charcoalBlue"
          />
        ),
      },
    };
    return config[toastrType] || config.default;
  }, [toastrType]);

  // Handle the close sequence - wrapped in useCallback to prevent recreation on each render
  const handleClose = useCallback(() => {
    setIsVisible(false);
    if (onClose) onClose(); // Notify parent when closing
  }, [onClose]);

  // Start the timer when the component mounts
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      handleClose();
    }, duration);

    // Cleanup timer on unmount or duration change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration, handleClose]); // Added handleClose to dependency array

  // Only render if visible
  if (!isVisible) return null;

  return (
    <div
      role="alert" // ARIA role for accessibility
      aria-live="polite"
      className="w-96 h-9 flex items-center justify-between p-2 relative overflow-hidden shadow-sm transition-opacity duration-300"
      style={{
        backgroundColor: "#d3d8de", // Fixed background color
        marginBottom: "8px",
        opacity: isVisible ? 1 : 0,
      }}
    >
      {/* Icon and Message Container */}
      <div className="flex items-center gap-2">
        {toastrConfig.icon}
        <div
          className="text-medium leading-[16px]"
          style={{
            color: "#0C111D", // Fixed text color
            whiteSpace: "pre-wrap",
            lineHeight: "20px", // Adjusted for better alignment
          }}
        >
          {message}
        </div>
      </div>

      {/* Close Icon */}
      <button
        onClick={handleClose}
        aria-label="Close notification"
        className="flex items-center w-4 h-4 text-tertiary-light hover:text-gray-600"
      >
        <X height={16} width={16} />
      </button>

      {/* Timer Bar with Animation */}
      <div
        className="w-96 h-1 absolute bottom-0 left-0"
        style={{
          background: "linear-gradient(to right, #bc62ca, #e4984f)", // Fixed gradient
          animation: `fillWidth ${duration}ms linear forwards`,
        }}
      />
    </div>
  );
};

export default Toastr;
