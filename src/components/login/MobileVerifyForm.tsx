"use client";

import { useState, useContext } from "react";
import { X } from "lucide-react";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { LoadingContext } from "@/components/ClientLoadingWrapper";
import MobileVerifyInput from "../ui/input/MobileVerifyInput";

interface MobileVerifyFormProps {
  readonly onClose?: () => void;
  readonly onSubmitCode?: (authCode: string) => void;
  readonly initialCode?: string[];
  className?: string;
  style?: React.CSSProperties;
}

function MobileVerifyForm({
  onClose,
  onSubmitCode,
  initialCode = ["", "", "", ""],
  className = "",
  style,
}: MobileVerifyFormProps) {
  const { setLoading, isLoading } = useContext(LoadingContext);
  const [code, setCode] = useState<string[]>(initialCode.slice(0, 4));
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || code.length !== 4 || code.some((digit) => !digit)) return;

    setLoading(true);
    setError("");

    const authCode = code.join("");
    try {
      if (onSubmitCode) {
        await onSubmitCode(authCode);
        setCode(["", "", "", ""]);
      }
    } catch {
      setError("Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (newCode: string[]) => {
    if (newCode.length === 4) {
      setCode(newCode);
      if (error && newCode.every((digit) => digit)) setError("");
    }
  };

  const handleClose = () => {
    setCode(["", "", "", ""]);
    setError("");
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
          disabled={isLoading}
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>
      <div className="w-full relative mb-6">
        <div className="text-gray-800 text-xl font-semibold font-['Inter'] text-center w-full">
          New Log-In Credentials
        </div>
      </div>
      <div className="w-full relative mb-6">
        <div className="self-stretch text-center justify-start text-gray-700 text-sm font-semibold font-['Inter'] leading-[30px]">
          Enter the last 4 digits of your mobile
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col justify-center items-center gap-4"
        aria-describedby={error ? "error-message" : undefined}
      >
        <MobileVerifyInput
          code={code}
          onChange={handleCodeChange}
          error={error}
          onReset={() => {
            setCode(["", "", "", ""]);
            setError("");
          }}
          disabled={isLoading}
        />

        <div className="w-full flex flex-col">
          <PixieButton
            label="Continue"
            type="submit"
            disabled={
              isLoading || code.length !== 4 || code.some((digit) => !digit)
            }
            isLoading={isLoading}
            className="bg-black text-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-inner border-2 border-white/10"
          />
        </div>
        <div className="text-gray-600 text-sm"></div>
      </form>
    </div>
  );
}

export default MobileVerifyForm;
