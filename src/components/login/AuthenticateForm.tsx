"use client";

import { useState, useContext, useEffect, useRef } from "react";
import { X } from "lucide-react";
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
}: AuthenticateFormProps) {
  const { setLoading, isLoading } = useContext(LoadingContext); // Access loading state from context
  const [code, setCode] = useState(initialCode); // State for the 6-digit code
  const [error, setError] = useState(""); // State for error messages
  const [attempts, setAttempts] = useState(0); // State for tracking submission attempts

  // Ref to track if we should auto-submit
  const shouldAutoSubmitRef = useRef(false);

  /**
   * Effect to handle auto-submission when code is complete
   */
  useEffect(() => {
    // Check if all digits are filled and auto-submit flag is true
    if (
      code.every((digit) => digit !== "") &&
      shouldAutoSubmitRef.current &&
      !isLoading
    ) {
      // Reset the auto-submit flag
      shouldAutoSubmitRef.current = false;
      // Submit after state updates are complete
      handleSubmit();
    }
  }, [code, isLoading]);

  /**
   * Handles form submission, either triggered manually or automatically
   * @param {React.FormEvent<HTMLFormElement>} [e] - Optional form event
   */
  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    // Prevent default form submission if event is provided
    if (e) e.preventDefault();

    // Get the current code value
    const authCode = code.join("");

    // Validate the code is complete before proceeding
    if (authCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    // Set loading state to true to show loading indicator
    setLoading(true);

    // Call the provided onSubmitCode callback with the auth code
    if (onSubmitCode) {
      onSubmitCode(authCode);
      // Reset code to initial state after submission
      setCode(initialCode);
    }
  };

  /**
   * Handles changes to the passcode input
   * @param {string[]} newCode - The updated code array
   */
  const handleCodeChange = (newCode: string[]) => {
    // Update the code state with new values
    setCode(newCode);

    // Clear error message if all digits are filled
    if (error && newCode.every((digit) => digit !== "")) setError("");

    // Set flag to auto-submit when all digits are filled
    if (newCode.every((digit) => digit !== "")) {
      shouldAutoSubmitRef.current = true;
    }
  };

  /**
   * Handles form closure and resets state
   */
  const handleClose = () => {
    // Reset code to initial state
    setCode(initialCode);

    // Call the provided onClose callback if it exists
    if (onClose) onClose();
  };

  return (
    <div
      className={`w-full min-h-[264px] min-w-[358px] bg-white rounded-xl shadow-lg flex flex-col items-start p-8 absolute z-50 ${className}`}
      style={style}
    >
      {/* Close button section */}
      <div className="w-full relative mb-6">
        <button
          onClick={handleClose}
          className="w-6 h-6 inline-flex justify-center items-center focus:outline-none absolute top-0 right-0"
          aria-label="Close"
          disabled={isLoading}
        >
          <X className="w-6 h-6 text-secondary-button" />
        </button>
      </div>

      {/* Form title section */}
      <div className="w-full relative mb-6">
        <div className="text-tertiary-deepNavy text-xl font-semibold font-['Inter'] text-center w-full">
          {label}
        </div>
      </div>

      {/* Optional sub-label section */}
      {subLabel && (
        <div className="w-full relative mb-6">
          <div className="self-stretch text-center justify-start text-[#0f1728] text-sm font-normal font-['Inter'] leading-[30px]">
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

        {/* Error message display */}
        {error && (
          <div id="error-message" className="text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Submit button section */}
        <div className="w-full flex flex-col">
          <PixieButton
            label={"Submit"}
            type="submit"
            disabled={isLoading || code.some((digit) => digit === "")}
            isLoading={isLoading}
            className="bg-black text-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-inner border-2 border-white/10"
          />
        </div>
        <div className="text-gray-600 text-sm"></div>
      </form>
    </div>
  );
}

export default AuthenticateForm;
