"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useContext } from "react";

import CustomInput from "@/components/ui/input/CustomInput";
import PixieButton from "@/components/ui/buttons/PixieButton";
import AuthenticateForm from "@/components/login/AuthenticateForm";
import { LoadingContext } from "@/components/ClientLoadingWrapper";

interface LoginCardProps {
  readonly onSubmit: (formData: {
    email: string;
    identifier: string;
    otp: string;
  }) => void;
  readonly isSubmitting: boolean;
  initialAuthCode?: string[];
  error?: string;
  attempts?: number;
}

export default function LoginCard({
  onSubmit,
  isSubmitting,
  initialAuthCode = ["", "", "", "", "", ""],
  error,
  attempts = 0,
}: LoginCardProps) {
  const router = useRouter();
  const { setLoading } = useContext(LoadingContext);
  const [formData, setFormData] = useState({
    email: "",
    identifier: "",
    otp: "",
  });
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authCode, setAuthCode] = useState<string[]>(initialAuthCode);

  const handleInputChange =
    (field: keyof typeof formData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowAuthForm(true);
  };

  const handleAuthCodeSubmit = (authCode: string) => {
    setLoading(true); // Trigger loading overlay
    setAuthCode(authCode.split(""));
    onSubmit({ ...formData, otp: authCode });
    handleCloseAuth();
  };

  const handleCloseAuth = () => {
    setAuthCode(initialAuthCode);
    setShowAuthForm(false);
  };

  const switchToReset = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setLoading(true); // Trigger loading overlay
    router.push("/reset");
  };

  return (
    <div className="w-full h-[1262px] max-xs:h-[932px] bg-tertiary-ghostWhite/50 border border-tertiary-fill rounded-[10px] flex flex-col items-center p-5 relative">
      <div className="w-full flex flex-col justify-center items-center">
        <Image
          src="/security-shield.svg"
          alt="Logo"
          width={154}
          height={155}
          className="object-contain w-24 sm:w-32 md:w-40 lg:w-[154px]"
          priority
        />
        <form
          onSubmit={handleSubmit}
          className="self-stretch flex flex-col justify-end items-end gap-4"
        >
          <div className="w-full flex flex-col items-center py-[28px]">
            <h1 className="w-full text-center text-tertiary-deepNavy text-xl sm:text-2xl md:text-3xl font-semibold font-['Inter'] leading-tight sm:leading-8 md:leading-[38px]">
              Log in to your account
            </h1>
          </div>

          <div className="self-stretch flex flex-col justify-center items-center gap-4">
            <CustomInput
              label="Email"
              value={formData.email}
              onChange={handleInputChange("email")}
              placeholder="Enter your email"
              isEditing={true}
              containerClassName="h-[91px] w-[358px]"
            />

            <CustomInput
              label="User ID or Workflow ID"
              value={formData.identifier}
              onChange={handleInputChange("identifier")}
              placeholder="Enter your ID"
              isEditing={true}
              containerClassName="w-[358px]"
            />

            <div className="w-[358px] flex flex-col justify-center items-end ">
              <span
                className="text-secondary-light text-sm font-normal font-['Inter'] underline cursor-pointer"
                onClick={switchToReset}
              >
                Generate User ID
              </span>
            </div>

            <div className="w-[358px] flex flex-col items-center gap-2">
              <PixieButton
                label={"Sign-In"}
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.email ||
                  !formData.identifier ||
                  (attempts >= 3 && !!error)
                }
                isLoading={isSubmitting}
                className="w-full"
              />
              {error && (
                <div className="w-full text-tertiary-vermilion text-sm font-normal font-['Inter'] leading-tight text-center">
                  <span dangerouslySetInnerHTML={{ __html: error }} />
                </div>
              )}
            </div>
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
  );
}
