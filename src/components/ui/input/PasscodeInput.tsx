"use client";

import React, { useEffect, useRef } from "react";

interface PasscodeInputProps {
  code: string[];
  onChange: (code: string[]) => void;
  error?: string;
  attempts?: number;
  onReset?: () => void;
  className?: string;
}

export default function PasscodeInput({
  code,
  onChange,
  error,
  onReset,
}: PasscodeInputProps) {
  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement | null>>>(
    [...Array(6)].map(() => React.createRef<HTMLInputElement>())
  );

  const handleInputChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (/^[0-9]$/.test(value) || value === "") {
        const newCode = [...code];
        newCode[index] = value;
        onChange(newCode);

        if (value !== "" && index < 5) {
          inputRefs.current[index + 1]?.current?.focus();
        }
      }
    };

  const handleKeyDown =
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && code[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.current?.focus();
      }
    };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const parsedData = pastedData.replace(/\D/g, ""); // Remove non-numeric characters

    // Check if pasted content has at least 6 digits
    if (parsedData.length >= 6) {
      const newCode = [...code];
      // Fill in the code array with the first 6 digits
      for (let i = 0; i < 6; i++) {
        newCode[i] = parsedData[i] || "";
      }
      onChange(newCode);

      // Focus the last input after pasting
      if (newCode[5] !== "") {
        inputRefs.current[5]?.current?.focus();
      }
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.current?.focus();
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-2">
      <div className="h-10 sm:h-11 inline-flex flex-col justify-start items-start gap-1 sm:gap-1.5">
        <div className="self-stretch inline-flex justify-start items-center gap-2 sm:gap-3">
          {/* First group of 3 digits */}
          <div className="grow shrink basis-0 h-10 sm:h-11 flex justify-start items-center gap-1 sm:gap-[3px]">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className={`grow shrink basis-0 h-10 sm:h-11 px-2 sm:px-3.5 py-2 sm:py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border ${
                  error ? "border-tertiary-vermilion" : "border-tertiary-stroke"
                } flex justify-start items-center gap-1 sm:gap-2`}
              >
                <input
                  ref={inputRefs.current[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={code[index]}
                  onChange={handleInputChange(index)}
                  onKeyDown={handleKeyDown(index)}
                  onPaste={index === 0 ? handlePaste : undefined} // Only add paste handler to first input
                  className="w-full h-5 sm:h-6 text-center text-base sm:text-lg font-medium text-tertiary-deepNavy focus:outline-none bg-transparent"
                />
              </div>
            ))}
          </div>

          {/* Separator */}
          <div className="relative justify-start text-tertiary-slateBlue text-xs sm:text-sm font-medium font-['Inter'] leading-tight">
            -
          </div>

          {/* Second group of 3 digits */}
          <div className="grow shrink basis-0 h-10 sm:h-11 flex justify-start items-center gap-1 sm:gap-[3px]">
            {[...Array(3)].map((_, index) => (
              <div
                key={index + 3}
                className={`grow shrink basis-0 h-10 sm:h-11 px-2 sm:px-3.5 py-2 sm:py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border ${
                  error ? "border-tertiary-vermilion" : "border-tertiary-stroke"
                } flex justify-start items-center gap-1 sm:gap-2`}
              >
                <input
                  ref={inputRefs.current[index + 3]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={code[index + 3]}
                  onChange={handleInputChange(index + 3)}
                  onKeyDown={handleKeyDown(index + 3)}
                  className="w-full h-5 sm:h-6 text-center text-base sm:text-lg font-medium text-tertiary-deepNavy focus:outline-none bg-transparent"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {error && (
        <div className="w-full text-tertiary-vermilion text-sm font-normal font-['Inter'] leading-tight text-center">
          <span dangerouslySetInnerHTML={{ __html: error }} />
          <span
            className="text-secondary-light underline ml-1 cursor-pointer"
            onClick={onReset}
          >
            Reset code
          </span>
        </div>
      )}
    </div>
  );
}
