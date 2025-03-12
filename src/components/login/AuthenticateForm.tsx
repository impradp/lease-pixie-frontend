"use client";

import { useState } from "react";
import { X } from "lucide-react";
import PixieButton from "@/components/ui/buttons/PixieButton";
import PasscodeInput from "@/components/ui/input/PasscodeInput";

interface AuthenticateFormProps {
  readonly onClose?: () => void;
  readonly onSubmitCode?: (authCode: string) => void;
  readonly initialCode?: string[];
  className?: string;
  style?: React.CSSProperties;
}

export default function AuthenticateForm({
  onClose,
  onSubmitCode,
  initialCode = ["", "", "", "", "", ""],
  className = "",
  style,
}: AuthenticateFormProps) {
  const [code, setCode] = useState(initialCode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const authCode = code.join("");
    if (onSubmitCode) {
      onSubmitCode(authCode);
      setCode(initialCode);
    }
  };

  const handleCodeChange = (newCode: string[]) => {
    setCode(newCode);
    if (error && newCode.every((digit) => digit !== "")) setError("");
  };

  const handleClose = () => {
    setCode(initialCode);
    if (onClose) onClose();
  };

  return (
    <div
      className={`w-full min-h-[264px] min-w-[358px] bg-white rounded-xl shadow-lg flex flex-col items-start p-8 absolute z-50 ${className}`}
      style={style}
    >
      <div className="w-full relative mb-6">
        <button
          onClick={handleClose}
          className="w-6 h-6 inline-flex justify-center items-center focus:outline-none absolute top-0 right-0"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-secondary-button" />
        </button>
      </div>
      <div className="w-full relative mb-6">
        <div className="text-tertiary-deepNavy text-xl font-semibold font-['Inter'] text-center w-full">
          Authentication code
        </div>
      </div>

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
            setCode(["", "", "", "", "", ""]);
            setAttempts(0);
            setError("");
          }}
        />

        <div className="w-full flex flex-col">
          <PixieButton
            label={isSubmitting ? "Submitting..." : "Submit"}
            type="submit"
            disabled={code.some((digit) => digit === "") || isSubmitting}
            className="bg-black text-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-inner border-2 border-white/10"
          />
        </div>
        <div className="text-gray-600 text-sm"></div>
      </form>
    </div>
  );
}
