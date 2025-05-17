"use client";

import { X } from "lucide-react";
import { useState, useContext, useEffect, useRef } from "react";

import LinkButton from "@/components/ui/buttons/LinkButton";
import PixieButton from "@/components/ui/buttons/PixieButton";
import PasscodeInput from "@/components/ui/input/PasscodeInput";
import { LoadingContext } from "@/components/ClientLoadingWrapper";

/**
 * Props for the AuthenticateForm component
 * @interface AuthenticateFormProps
 */
interface AuthenticateFormProps {
  readonly onClose?: () => void;
  readonly onSubmitCode?: (authCode: string) => void;
  readonly initialCode?: string[];
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  subLabel?: string;
  showCancelButton?: boolean;
}

/**
 * A form component for entering a 6-digit authentication code with auto-submit functionality
 * @param {AuthenticateFormProps} props - Component properties
 * @returns {JSX.Element} The rendered authentication form
 */
function AuthenticateForm({
  onClose,
  onSubmitCode,
  initialCode = ["", "", "", "", "", ""],
  className = "",
  style,
  label = "Authentication code",
  subLabel,
  showCancelButton = false,
}: AuthenticateFormProps) {
  const { setLoading, isLoading } = useContext(LoadingContext);
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const shouldAutoSubmitRef = useRef(false);

  /**
   * Effect to handle auto-submission when code is complete
   */
  useEffect(() => {
    if (
      code.every((digit) => digit !== "") &&
      shouldAutoSubmitRef.current &&
      !isLoading
    ) {
      shouldAutoSubmitRef.current = false;
      handleSubmit();
    }
  }, [code, isLoading]);

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const authCode = code.join("");

    // Validate the code is complete before proceeding
    if (authCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    setLoading(true);
    if (onSubmitCode) {
      onSubmitCode(authCode);
      setCode(initialCode);
    }
  };

  /**
   * Handles changes to the passcode input
   * @param {string[]} newCode - The updated code array
   */
  const handleCodeChange = (newCode: string[]) => {
    setCode(newCode);
    if (error && newCode.every((digit) => digit !== "")) setError("");
    if (newCode.every((digit) => digit !== "")) {
      shouldAutoSubmitRef.current = true;
    }
  };

  /**
   * Handles form closure and resets state
   */
  const handleClose = () => {
    setCode(initialCode);
    if (onClose) onClose();
  };

  return (
    <div
      className={`w-full max-w-[358px] min-w-[280px] p-8 bg-tertiary-fill rounded-xl shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05),0px_1px_4px_0px_rgba(12,12,13,0.10)] outline outline-1 outline-offset-[-1px] outline-tertiary-steelBlueDusk flex flex-col items-start absolute z-50 ${className}`}
      style={style}
    >
      <div className="w-6 h-6 relative overflow-hidden mb-2 self-end">
        <button
          onClick={handleClose}
          className="w-6 h-6 inline-flex justify-center items-center focus:outline-none absolute top-0 right-0"
          aria-label="Close"
          disabled={isLoading}
        >
          <X className="w-6 h-6 text-tertiary-light" />
        </button>
      </div>

      <div className="w-full mb-6">
        <div className="text-tertiary-deepNavy text-xl font-semibold font-['Inter'] text-center">
          {label}
        </div>
      </div>

      {subLabel && (
        <div className="w-full mb-6">
          <div className="text-tertiary-deepNavy text-sm font-normal font-['Inter'] text-center leading-[30px]">
            {subLabel}
          </div>
        </div>
      )}

      {/* Form with passcode input and submit button */}
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col justify-center items-center gap-4"
        aria-describedby={error ? "error-message" : undefined}
      >
        <PasscodeInput
          code={code}
          onChange={handleCodeChange}
          error={error}
          attempts={attempts}
          onReset={() => {
            // Reset form state when PasscodeInput requests a reset
            setCode(["", "", "", "", "", ""]);
            setAttempts(0);
            setError("");
          }}
          disabled={isLoading}
        />

        {error && (
          <div id="error-message" className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <PixieButton
          label="Submit"
          type="submit"
          disabled={isLoading || code.some((digit) => digit === "")}
          isLoading={isLoading}
          className="w-[294px] px-3.5 py-2.5 bg-black text-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05),inset_0px_-2px_0px_0px_rgba(16,24,40,0.05),inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] outline outline-2 outline-offset-[-2px] outline-white/10"
        />
        {showCancelButton && (
          <div className="flex justify-center">
            <LinkButton onClick={handleClose} disabled={isLoading} />
          </div>
        )}
      </form>
    </div>
  );
}

export default AuthenticateForm;
