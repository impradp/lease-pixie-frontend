"use client";

import React, { useEffect, useRef } from "react";

interface MobileVerifyInputProps {
  code: string[];
  onChange: (code: string[]) => void;
  error?: string;
  onReset?: () => void;
  className?: string;
  disabled?: boolean;
}

function MobileVerifyInput({
  code,
  onChange,
  error,
  onReset,
  className = "",
  disabled = false,
}: MobileVerifyInputProps) {
  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement | null>>>(
    [...Array(4)].map(() => React.createRef<HTMLInputElement>())
  );

  const handleInputChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const value = e.target.value;
      if (/^[0-9]$/.test(value) || value === "") {
        const newCode = [...code];
        newCode[index] = value;
        onChange(newCode);

        if (value !== "" && index < 3) {
          inputRefs.current[index + 1]?.current?.focus();
        }
      }
    };

  const handleKeyDown =
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (e.key === "Backspace" && code[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.current?.focus();
      }
    };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const parsedData = pastedData.replace(/\D/g, "");
    if (parsedData.length >= 4) {
      const newCode = [...code];
      for (let i = 0; i < 4; i++) {
        newCode[i] = parsedData[i] || "";
      }
      onChange(newCode);
      if (newCode[3] !== "") {
        inputRefs.current[3]?.current?.focus();
      }
    }
  };

  useEffect(() => {
    if (!disabled) {
      inputRefs.current[0]?.current?.focus();
    }
  }, [disabled]);

  return (
    <div
      className={`w-[182px] flex flex-col justify-center items-center gap-2 ${className}`}
    >
      <div className="h-10 sm:h-11 inline-flex flex-col justify-start items-start gap-1 sm:gap-1.5">
        <div className="self-stretch inline-flex justify-start items-center gap-2 sm:gap-3">
          <div className="grow shrink basis-0 h-10 sm:h-11 flex justify-start items-center gap-1 sm:gap-[3px]">
            {[...Array(4)].map((_, index) => (
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
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={disabled}
                  className="w-full h-5 sm:h-6 text-center text-base sm:text-lg font-medium text-tertiary-light focus:outline-none bg-transparent disabled:opacity-50"
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

export default MobileVerifyInput;
