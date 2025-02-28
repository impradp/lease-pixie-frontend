"use client";

import Image from "next/image";
import React, { useState } from "react";
import PixieButton from "@/components/ui/buttons/PixieButton";
import AuthenticateForm from "@/components/login/AuthenticateForm";

interface WelcomeCardProps {
  email: string;
  onSignIn?: (propertyId: string, authCode?: string) => void;
  onSignOut?: () => void;
  initialAuthCode?: string[];
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
  email,
  onSignIn,
  onSignOut,
  initialAuthCode = ["", "", "", "", "", ""],
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(true);
  const [authCode, setAuthCode] = useState<string[]>(initialAuthCode);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSignOut?.();
  };

  const handleAuthCodeSubmit = (authCode: string) => {
    setAuthCode(authCode.split(""));
    if (onSignIn) {
      onSignIn(authCode);
    }
    setShowAuthForm(false);
    setIsSubmitting(false);
  };

  const handleCloseAuth = () => {
    setShowAuthForm(false);
    setIsSubmitting(false);
  };

  return (
    <div className="w-full h-[1262px] bg-tertiary-ghostWhite/50 border border-tertiary-fill rounded-[10px] flex flex-col items-center p-5 relative">
      <div className="w-full flex flex-col justify-center items-center gap-[28px]">
        <Image
          src="/security-shield.svg"
          alt="Logo"
          width={154}
          height={155}
          className="object-contain w-[154px]"
          priority
        />
        <div className="self-stretch inline-flex flex-col justify-start items-start gap-3">
          <div className="self-stretch flex flex-col justify-start items-start gap-3">
            <div className="self-stretch text-center justify-start text-tertiary-deepNavy text-[28px] font-semibold font-['Inter'] leading-[38px]">
              Workflow found for
            </div>
            <div className="self-stretch h-6 text-center justify-start text-tertiary-deepNavy text-2xl font-medium font-['Inter'] leading-normal">
              {email}
            </div>
          </div>
        </div>

        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center gap-4"
          >
            <div className="w-full flex flex-col max-w-md bg-black text-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-inner border-2 border-white/10">
              <PixieButton
                label={isSubmitting ? "Signing Out..." : "Sign-Out"}
                type="submit"
                disabled={isSubmitting}
              />
            </div>
          </form>
        </div>
        {showAuthForm && (
          <div className="absolute top-40 left-0 right-0 flex justify-center z-50">
            <AuthenticateForm
              onClose={handleCloseAuth}
              onSubmitCode={handleAuthCodeSubmit}
              initialCode={authCode}
              className="w-full max-w-[358px] min-w-[280px]"
            />
          </div>
        )}
      </div>
      {showAuthForm && (
        <div className="fixed inset-0 bg-black/50 z-40" aria-hidden="true" />
      )}
    </div>
  );
};

export default WelcomeCard;
