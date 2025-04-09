"use client";

import { useState, useEffect, useRef, useContext, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import toastr from "@/lib/func/toastr";
import { authService } from "@/lib/services/auth";
import { emailService } from "@/lib/services/email";
import { loginService } from "@/lib/services/login";
import LoginCard from "@/components/login/LoginCard";
import { getDefaultPage } from "@/config/roleAccess";
import ResetCard from "@/components/reset/ResetCard";
import { cookieHandler } from "@/lib/services/cookieHandler";
import WorkflowCard from "@/components/workflows/WorkflowCard";
import { LoadingContext } from "@/components/ClientLoadingWrapper";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const { setLoading, isLoading } = useContext(LoadingContext);
  const [showLogin, setShowLogin] = useState(true);
  const [showAuthForm, setShowAuthForm] = useState(false);

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

  const hasShownLogoutToastr = useRef(false);
  const hasShownResetToastr = useRef(false);

  useEffect(() => {
    const loggedOut = searchParams.get("loggedOut");
    if (loggedOut === "true" && !hasShownLogoutToastr.current) {
      toastr({
        message: "Logged out successfully.",
        toastrType: "success",
      });
      hasShownLogoutToastr.current = true;
      router.replace("/login");
    }

    const resetSuccess = searchParams.get("reset");
    if (resetSuccess === "true" && !hasShownResetToastr.current) {
      toastr({
        message: "SMS sent sucessfully.",
        toastrType: "success",
      });
      hasShownResetToastr.current = true;
      router.push("/login");
    }
  }, [searchParams, router]);

  useEffect(() => {
    const { attempts: cookieAttempts, lastFailedAttempt } =
      cookieHandler.getLoginAttempts();
    setAttempts(cookieAttempts || 0);
    if (cookieAttempts >= 3 && lastFailedAttempt) {
      updateLockoutMessage(lastFailedAttempt);
    }
  }, []);

  const handleLogin = async (formData: {
    email: string;
    identifier: string;
    otp: string;
  }) => {
    try {
      setLoading(true); // Set loading immediately
      setShowAuthForm(false); //Close the form
      await new Promise((resolve) => requestAnimationFrame(resolve)); // Ensure UI updates

      const response = await loginService.login({
        loginId: formData.identifier,
        totpSecret: formData.otp,
        email: formData.email,
      });

      if (response.status === "SUCCESS") {
        setShowAuthForm(false);
        const now = new Date().toISOString();
        cookieHandler.setLoginAttempts(0, now, null, 86400);
        router.push(getDefaultPage()); // Trigger redirection (ClientLoadingWrapper will handle loading state)
      } else {
        toastr({
          message: "Login failed.",
          toastrType: "error",
        });
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
        setLoading(false); // Clear loading on failure
      }
    } catch {
      toastr({
        message: "Login failed.",
        toastrType: "error",
      });
      setError("An unexpected error occurred. Please try again.");
      setLoading(false); // Clear loading on error
    }
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
        toastr({
          message: "Reset code verification failed.",
          toastrType: "error",
        });
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
      toastr({
        message: "Reset failed.",
        toastrType: "error",
      });
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
        toastr({
          message: "SMS sending failed.",
          toastrType: "error",
        });
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
      toastr({
        message: "Reset failed.",
        toastrType: "error",
      });
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
        toastr({
          message:
            "We have sent a reset code via e-mail if the provided information is valid.",
          toastrType: "info",
        });
      } else {
        toastr({
          message: "Reset code is invalid. Please try again.",
          toastrType: "error",
        });
      }
    } catch {
      toastr({
        message: "Reset Failed.",
        toastrType: "error",
      });
      setError("An unexpected error occurred. Please try again.");
    }
    setLoading(false);
  };

  const resetState = () => {
    setEmailSent(false);
    setIsEmailCodeVerified(false);
    setFormData({ email: "", phoneNumber: "" });
    setError("");
    setAttempts(0);
    cookieHandler.clearLoginAttempts();
  };

  const handleLoginResetSwitch = (isVisible: boolean) => {
    setShowLogin(isVisible);
  };

  const handleSetShowAuthForm = (isVisible: boolean) => {
    setShowAuthForm(isVisible);
  };

  return (
    <div className="flex flex-col custom:flex-row custom:gap-4 mt-4 custom:mt-0 min-h-screen py-4 items-center custom:items-start justify-center">
      <div className="w-[408px] max-w-full flex justify-center mb-4 max-xs:order-2 custom:mb-0">
        <WorkflowCard />
      </div>
      <div className="w-[408px] custom:w-full max-w-full custom:flex-1 flex max-xs:order-1 mb-4 justify-center">
        {showLogin && (
          <LoginCard
            onSubmit={handleLogin}
            isSubmitting={isLoading}
            error={error}
            attempts={attempts}
            setShowLogin={handleLoginResetSwitch}
            isAuthFormVisible={showAuthForm}
            setShowAuthForm={handleSetShowAuthForm}
          />
        )}

        {!showLogin && (
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
            setShowLogin={handleLoginResetSwitch}
          />
        )}
      </div>
    </div>
  );
}

const LoginPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;
