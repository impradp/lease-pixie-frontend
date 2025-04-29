"use client";

import Image from "next/image";
import { useState, useContext, useEffect } from "react";

import ConsentForm from "@/components/ui/ConsentForm";
import CustomInput from "@/components/ui/input/CustomInput";
import PixieButton from "@/components/ui/buttons/PixieButton";
import AuthenticateForm from "@/components/login/AuthenticateForm";
import { LoadingContext } from "@/components/ClientLoadingWrapper";

interface ResetCardProps {
  readonly onSubmit: (formData: {
    email: string;
    mobileNumber: string;
  }) => void;
  readonly onResetCodeVerify: (otp: string) => void;
  readonly onConsentSubmit: (formData: {
    smsConsent: boolean;
    serviceConsent: boolean;
    cookieConsent: boolean;
  }) => void;
  readonly onCancel: () => void;
  readonly isSubmitting: boolean;
  initialAuthCode?: string[];
  error?: string;
  attempts?: number;
  emailSent?: boolean;
  isEmailCodeVerified?: boolean;
  setShowLogin: (isVisible: boolean, email?: string) => void;
  email?: string; // New prop to receive email from parent
  onEmailChange?: (email: string) => void; // New prop to report email changes
  defaultData?: { email: string; mobileNumber: string };
}

function ResetCard({
  onSubmit,
  onConsentSubmit,
  onCancel,
  isSubmitting,
  initialAuthCode = ["", "", "", "", "", ""],
  error,
  attempts = 0,
  emailSent = false,
  onResetCodeVerify,
  isEmailCodeVerified,
  setShowLogin,
  defaultData,
  onEmailChange = () => {}, // Default to no-op function
}: ResetCardProps) {
  const { setLoading } = useContext(LoadingContext);
  const [formData, setFormData] = useState({
    email: defaultData?.email ?? "", // Initialize with passed email
    mobileNumber: defaultData?.mobileNumber ?? "",
    otp: "",
  });
  const [smsConsent, setSMSConsent] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(false);
  const [serviceConsent, setServiceConsent] = useState(false);
  const [showSMSConsentForm, setShowSMSConsentForm] = useState(false);
  const [authCode, setAuthCode] = useState<string[]>(initialAuthCode);
  const [showServiceConsentForm, setShowServiceConsentForm] = useState(false);
  const [showCookieConsentForm, setShowCookieConsentForm] = useState(false);

  useEffect(() => {
    if (isEmailCodeVerified) {
      setShowSMSConsentForm(true);
      setShowAuthForm(false);
    }
  }, [isEmailCodeVerified]);

  useEffect(() => {
    if (emailSent) {
      setShowAuthForm(true); // Only show auth form when emailSent is true
    }
  }, [emailSent]);

  const handleInputChange =
    (field: keyof typeof formData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Report email changes back to parent
      if (field === "email") {
        onEmailChange(value);
      }
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.email && formData.mobileNumber) {
      onSubmit({
        email: formData.email,
        mobileNumber: formData.mobileNumber,
      });
    }
  };

  const switchToLogin = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    // Pass the current email when switching back to login
    setShowLogin(true, formData.email);
  };

  const handleAuthCodeSubmit = (authCode: string) => {
    setLoading(true);
    setAuthCode(authCode.split(""));
    onResetCodeVerify(authCode);
    setAuthCode(initialAuthCode);
  };

  const handleCloseAuth = () => {
    setAuthCode(initialAuthCode);
    setShowAuthForm(false);
    onCancel();
  };

  const handleSMSConsentSubmit = () => {
    setSMSConsent(true);
    setShowSMSConsentForm(false);
    setShowServiceConsentForm(true);
  };

  const handleServiceConsentSubmit = () => {
    setServiceConsent(true);
    setShowServiceConsentForm(false);
    setShowCookieConsentForm(true);
  };

  const handleCookieConsentSubmit = () => {
    setCookieConsent(true);
    setShowCookieConsentForm(false);
    onConsentSubmit({ smsConsent, serviceConsent, cookieConsent });
  };

  const handleConsentClose = () => {
    setShowSMSConsentForm(false);
    setShowServiceConsentForm(false);
    setShowCookieConsentForm(false);
    setSMSConsent(false);
    setServiceConsent(false);
    setCookieConsent(false);
    onCancel();
  };

  // Check if any popup is active
  const isAnyPopupActive =
    showAuthForm ||
    showSMSConsentForm ||
    showServiceConsentForm ||
    showCookieConsentForm;

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
              Reset your User ID
            </h1>
          </div>

          <div className="self-stretch flex flex-col justify-center items-center gap-4">
            <CustomInput
              label="Email"
              value={formData?.email ?? ""}
              onChange={handleInputChange("email")}
              placeholder="Enter your email"
              isEditing={true}
              containerClassName="h-[91px] w-[358px]"
              type="email"
              isRequired={true}
            />

            <CustomInput
              label="Mobile number"
              value={formData?.mobileNumber ?? ""}
              onChange={handleInputChange("mobileNumber")}
              isEditing={true}
              placeholder="800-555-1234"
              type="mobile"
              containerClassName="w-[358px]"
              isRequired={true}
            />

            <div className="w-[358px] flex flex-col justify-center items-end ">
              <span
                className="text-secondary-light text-sm font-normal font-['Inter'] underline cursor-pointer"
                onClick={switchToLogin}
              >
                Log-In
              </span>
            </div>

            <div className="w-[358px] flex flex-col items-center gap-2">
              <PixieButton
                label={"Request Reset E-mail"}
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.email ||
                  !formData.mobileNumber ||
                  (attempts >= 3 && !!error) ||
                  isAnyPopupActive // Disable when any popup is active
                }
                isLoading={isSubmitting}
                className="w-full"
              />
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

      {showSMSConsentForm && (
        <div className="absolute top-40 left-0 right-0 flex justify-center z-50">
          <ConsentForm
            label="SMS Consent"
            consentLabel="I consent to receive SMS messages related to this service (message and data rates may apply)"
            onSubmit={handleSMSConsentSubmit}
            onClose={handleConsentClose}
            className="w-full max-w-[358px] min-w-[280px]"
          />
        </div>
      )}

      {showServiceConsentForm && (
        <div className="absolute top-40 left-0 right-0 flex justify-center z-50">
          <ConsentForm
            label="Service Terms"
            consentLabel="By using this service, I agree to the current Terms of Service and Privacy Policy."
            onSubmit={handleServiceConsentSubmit}
            onClose={handleConsentClose}
            className="w-full max-w-[358px] min-w-[280px]"
          />
        </div>
      )}

      {showCookieConsentForm && (
        <div className="absolute top-40 left-0 right-0 flex justify-center z-50">
          <ConsentForm
            label="Cookies Consent"
            consentLabel="I consent to the use of necessary cookies to provide the service."
            onSubmit={handleCookieConsentSubmit}
            onClose={handleConsentClose}
            className="w-full max-w-[358px] min-w-[280px]"
          />
        </div>
      )}

      {showAuthForm && (
        <div className="absolute top-40 left-0 right-0 flex justify-center z-50">
          <AuthenticateForm
            onClose={handleCloseAuth}
            onSubmitCode={handleAuthCodeSubmit}
            initialCode={authCode}
            className="w-full max-w-[358px] min-w-[280px]"
            label="Check your e-mail."
            subLabel="Reset code"
          />
        </div>
      )}
    </div>
  );
}

export default ResetCard;
