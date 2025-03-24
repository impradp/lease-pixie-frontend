"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/lib/services/auth";
import { emailService } from "@/lib/services/email";
import ResetCard from "@/components/reset/ResetCard";
import { ToastrMessage } from "@/types/ToastrMessage";
import Toastr from "@/components/ui/toastrPopup/Toastr";
import { cookieHandler } from "@/lib/services/cookieHandler";
import WorkflowCard from "@/components/workflows/WorkflowCard";
import { LoadingContext } from "@/components/ClientLoadingWrapper";

function ResetContent() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [toastrs, setToastrs] = useState<ToastrMessage[]>([]);
  const { setLoading, isLoading } = useContext(LoadingContext);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [isEmailCodeVerified, setIsEmailCodeVerified] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<{
    email: string;
    phoneNumber: string;
  }>({
    email: "",
    phoneNumber: "",
  });

  const toastrId = `toastr-${Date.now()}-${Math.random()}`;

  const resetState = () => {
    setEmailSent(false);
    setIsEmailCodeVerified(false);
    setFormData({ email: "", phoneNumber: "" });
    setError("");
    setAttempts(0);
    cookieHandler.clearLoginAttempts();
    setToastrs([]);
  };

  const updateLockoutMessage = (lastFailedAttempt: string) => {
    const lockoutDuration = 30 * 60 * 1000;
    const lastFailTime = new Date(lastFailedAttempt).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const remainingTime = Math.max(0, lockoutDuration - (now - lastFailTime));
      if (remainingTime === 0) {
        clearInterval(interval);
        setAttempts(0);
        const { lastSuccessfulLogin } = cookieHandler.getLoginAttempts();
        cookieHandler.setLoginAttempts(0, lastSuccessfulLogin, null);
        setError("");
      } else {
        const minutes = Math.floor(remainingTime / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        setError(`Try again after ${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  };

  useEffect(() => {
    const { attempts: cookieAttempts, lastFailedAttempt } =
      cookieHandler.getLoginAttempts();
    setAttempts(cookieAttempts || 0);
    if (cookieAttempts >= 3 && lastFailedAttempt) {
      updateLockoutMessage(lastFailedAttempt);
    }
  }, []);

  const handleEmailCodeVerify = async (otp: string) => {
    try {
      setLoading(true);
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const response = await authService.resetVerify({
        phoneNumber: formData.phoneNumber,
        resetCode: otp,
        email: formData.email,
      });
      if (response.status === "SUCCESS") {
        setIsEmailCodeVerified(true);
        setEmailSent(false);
      } else {
        setToastrs((prev) => [
          ...prev,
          {
            id: toastrId,
            message: "Reset code verification failed.",
            toastrType: "warning",
          },
        ]);
        const now = new Date().toISOString();
        setAttempts((prev) => {
          const newAttempts = prev + 1;
          cookieHandler.setLoginAttempts(newAttempts, null, now);
          if (newAttempts >= 3) {
            updateLockoutMessage(now);
          } else {
            setError(`Unsuccessful attempt ${newAttempts} of 3.`);
          }
          return newAttempts;
        });
      }
    } catch {
      setToastrs((prev) => [
        ...prev,
        { id: toastrId, message: "Reset failed.", toastrType: "warning" },
      ]);
      setError("An unexpected error occurred. Please try again.");
    }
    setLoading(false);
  };

  const handleConsentAgreement = async (data: {
    smsConsent: boolean;
    serviceConsent: boolean;
    cookieConsent: boolean;
  }) => {
    try {
      setLoading(true);
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const response = await authService.resolveConsent({
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        smsConsentAccepted: data.smsConsent,
        serviceTermConsentAccepted: data.serviceConsent,
        cookieConsentAccepted: data.cookieConsent,
      });
      if (response.status === "SUCCESS") {
        router.push("/login?reset=true");
      } else {
        setToastrs((prev) => [
          ...prev,
          {
            id: toastrId,
            message: "SMS sending failed.",
            toastrType: "warning",
          },
        ]);
        const now = new Date().toISOString();
        setAttempts((prev) => {
          const newAttempts = prev + 1;
          cookieHandler.setLoginAttempts(newAttempts, null, now);
          if (newAttempts >= 3) {
            updateLockoutMessage(now);
          } else {
            setError(`Unsuccessful attempt ${newAttempts} of 3.`);
          }
          return newAttempts;
        });
      }
    } catch {
      setToastrs((prev) => [
        ...prev,
        { id: toastrId, message: "Reset failed.", toastrType: "warning" },
      ]);
      setError("An unexpected error occurred. Please try again.");
    }
    setLoading(false);
  };

  const handleEmailRequest = async (formData: {
    email: string;
    mobileNumber: string;
  }) => {
    try {
      setLoading(true);
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const resetResponse = await emailService.resetLogin({
        phoneNumber: formData.mobileNumber.replaceAll("-", ""),
        email: formData.email,
      });

      if (resetResponse.status === "SUCCESS") {
        setEmailSent(true);
        setFormData({
          email: formData.email,
          phoneNumber: formData.mobileNumber.replaceAll("-", ""),
        });
        setToastrs((prev) => [
          ...prev,
          {
            id: toastrId,
            message:
              "We have sent a reset code via e-mail if the provided information is valid.",
            toastrType: "success",
          },
        ]);
      } else {
        setToastrs((prev) => [
          ...prev,
          {
            id: toastrId,
            message: "Reset code is invalid. Please try again.",
            toastrType: "warning",
          },
        ]);
      }
    } catch {
      setToastrs((prev) => [
        ...prev,
        { id: toastrId, message: "Reset failed.", toastrType: "warning" },
      ]);
      setError("An unexpected error occurred. Please try again.");
    }
    setLoading(false);
  };

  const handleToastrClose = (id: string) => {
    setToastrs((prev) => prev.filter((toastr) => toastr.id !== id));
  };

  return (
    <div className="flex flex-col custom:flex-row custom:gap-4 mt-4 custom:mt-0 min-h-screen py-4 items-center custom:items-start justify-center">
      {toastrs.length > 0 && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 xs:right-4 xs:left-auto xs:translate-x-0 z-50 flex flex-col gap-2">
          {toastrs.map((toastr) => (
            <Toastr
              key={toastr.id}
              message={toastr.message}
              toastrType={toastr.toastrType}
              onClose={() => handleToastrClose(toastr.id)}
            />
          ))}
        </div>
      )}
      <div className="w-[408px] max-w-full flex justify-center mb-4 max-xs:order-2 custom:mb-0">
        <WorkflowCard />
      </div>
      <div className="w-[408px] custom:w-full max-w-full custom:flex-1 flex max-xs:order-1 mb-4 justify-center">
        <ResetCard
          onSubmit={handleEmailRequest}
          isSubmitting={isLoading}
          error={error}
          attempts={attempts}
          emailSent={emailSent}
          isEmailCodeVerified={isEmailCodeVerified}
          onResetCodeVerify={handleEmailCodeVerify}
          onConsentSubmit={handleConsentAgreement}
          onCancel={resetState} // Pass reset function to ResetCard
        />
      </div>
    </div>
  );
}

export default function ResetPage() {
  return <ResetContent />;
}
