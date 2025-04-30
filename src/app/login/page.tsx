"use client";

import { useState, useEffect, useContext, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import handleToast from "@/lib/utils/toastr";
import handleInfo from "@/lib/utils/errorHandler";
import { authService } from "@/lib/services/auth";
import { emailService } from "@/lib/services/email";
import { loginService } from "@/lib/services/login";
import LoginCard from "@/components/login/LoginCard";
import { getDefaultPage } from "@/config/roleAccess";
import ResetCard from "@/components/reset/ResetCard";
import { sanitizeUrl } from "@/lib/utils/browserUtils";
import { cookieHandler } from "@/lib/services/cookieHandler";
import WorkflowCard from "@/components/workflows/WorkflowCard";
import { LoadingContext } from "@/components/ClientLoadingWrapper";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";

/**
 * Main content component for the login page, handling login and reset functionality
 * @returns {JSX.Element} The rendered login or reset card based on state
 */
function LoginContent() {
  const router = useRouter(); // Hook for programmatic navigation
  const searchParams = useSearchParams(); // Hook to access URL query parameters

  // State for managing error messages
  const [error, setError] = useState("");
  // State for tracking login attempts
  const [attempts, setAttempts] = useState(0);
  // Access loading state from context
  const { setLoading, isLoading } = useContext(LoadingContext);
  // State to toggle between login and reset views
  const [showLogin, setShowLogin] = useState(true);

  // State for tracking email reset code sent status
  const [emailSent, setEmailSent] = useState<boolean>(false);
  // State for tracking email code verification status
  const [isEmailCodeVerified, setIsEmailCodeVerified] =
    useState<boolean>(false);
  // State for form data (email and mobile number)
  const [formData, setFormData] = useState<{
    email: string;
    mobileNumber: string;
  }>({
    email: "",
    mobileNumber: "",
  });

  /**
   * Handles initial page load, processes toast messages, and cleans up URL
   */
  useEffect(() => {
    // Display toast messages based on query parameters
    handleToast(searchParams);
    sanitizeUrl("/login", searchParams);
  }, [searchParams, router]);

  /**
   * Initializes login attempt tracking from cookies
   */
  useEffect(() => {
    // Retrieve login attempts and last failed attempt from cookies
    const { attempts: cookieAttempts, lastFailedAttempt } =
      cookieHandler.getLoginAttempts();
    // Set attempts state from cookie or default to 0
    setAttempts(cookieAttempts || 0);
    // If 3 or more failed attempts, trigger lockout message
    if (cookieAttempts >= 3 && lastFailedAttempt) {
      updateLockoutMessage(lastFailedAttempt);
    }
  }, []);

  /**
   * Handles login submission
   * @param {Object} formData - Login form data
   * @param {string} formData.email - User's email
   * @param {string} formData.identifier - User or workflow ID
   * @param {string} formData.otp - One-time password
   */
  const handleLogin = async (formData: {
    email: string;
    identifier: string;
    otp: string;
  }) => {
    try {
      // Set loading state to true
      setLoading(true);
      // Ensure UI updates before async operations
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // Attempt login with provided credentials
      const response = await loginService.login({
        loginId: formData.identifier,
        totpSecret: formData.otp,
        email: formData.email,
      });

      // Handle successful login
      if (response.status === "SUCCESS") {
        const now = new Date().toISOString();
        // Reset login attempts on success
        cookieHandler.setLoginAttempts(0, now, null, 86400);
        // Redirect to default page with success message
        router.push(getDefaultPage() + "?msg=100300");
      } else {
        // Handle login failure
        handleInfo({ code: 100301 });
        const now = new Date().toISOString();
        setAttempts((prev) => {
          const newAttempts = prev + 1;
          // Update cookie with new attempt count
          cookieHandler.setLoginAttempts(newAttempts, null, now);
          // Trigger lockout if 3 or more attempts
          if (newAttempts >= 3) {
            updateLockoutMessage(now);
          } else {
            setError(`Unsuccessful attempt ${newAttempts} of 3.`);
          }
          return newAttempts;
        });
        // Clear loading state on failure
        setLoading(false);
      }
    } catch (err) {
      // Handle errors during login
      handleInfo({ code: 100301, error: err });
      setLoading(false);
    }
  };

  /**
   * Updates lockout message with a countdown timer
   * @param {string} lastFailedAttempt - Timestamp of last failed attempt
   * @returns {() => void} Cleanup function to clear interval
   */
  const updateLockoutMessage = (lastFailedAttempt: string) => {
    const lockoutDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
    const lastFailTime = new Date(lastFailedAttempt).getTime();
    // Start interval to update remaining lockout time
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const remainingTime = Math.max(0, lockoutDuration - (now - lastFailTime));
      // Clear lockout when time expires
      if (remainingTime === 0) {
        clearInterval(interval);
        setAttempts(0);
        const { lastSuccessfulLogin } = cookieHandler.getLoginAttempts();
        // Reset attempts in cookie
        cookieHandler.setLoginAttempts(0, lastSuccessfulLogin, null);
        setError("");
      } else {
        // Update error message with remaining time
        const minutes = Math.floor(remainingTime / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        setError(`Try again after ${minutes}m ${seconds}s`);
      }
    }, 1000);
    // Return cleanup function
    return () => clearInterval(interval);
  };

  /**
   * Verifies email reset code
   * @param {string} otp - One-time password for verification
   */
  const handleEmailCodeVerify = async (otp: string) => {
    try {
      setLoading(true);
      // Ensure UI updates before async operations
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // Verify reset code with auth service
      const response = await authService.resetVerify({
        mobileNumber: formData.mobileNumber,
        resetCode: otp,
        email: formData.email,
      });
      // Handle successful verification
      if (response.status === "SUCCESS") {
        setIsEmailCodeVerified(true);
        setEmailSent(false);
      } else {
        // Handle verification failure
        handleInfo({ code: 100401 });
        const now = new Date().toISOString();
        setAttempts((prev) => {
          const newAttempts = prev + 1;
          // Update cookie with new attempt count
          cookieHandler.setLoginAttempts(newAttempts, null, now);
          if (newAttempts >= 3) {
            updateLockoutMessage(now);
          } else {
            setError(`Unsuccessful attempt ${newAttempts} of 3.`);
          }
          return newAttempts;
        });
      }
    } catch (err) {
      // Handle errors during verification
      handleInfo({ code: 100402, error: err });
    }
    setLoading(false);
  };

  /**
   * Handles consent agreement submission
   * @param {Object} data - Consent data
   * @param {boolean} data.smsConsent - SMS consent status
   * @param {boolean} data.serviceConsent - Service terms consent status
   * @param {boolean} data.cookieConsent - Cookie consent status
   */
  const handleConsentAgreement = async (data: {
    smsConsent: boolean;
    serviceConsent: boolean;
    cookieConsent: boolean;
  }) => {
    try {
      setLoading(true);
      // Ensure UI updates before async operations
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // Submit consent data to auth service
      const response = await authService.resolveConsent({
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        smsConsentAccepted: data.smsConsent,
        serviceTermConsentAccepted: data.serviceConsent,
        cookieConsentAccepted: data.cookieConsent,
      });
      // Handle successful consent submission
      if (response.status === "SUCCESS") {
        // Redirect to login with success message
        router.push("/login?msg=100400");
      } else {
        // Handle consent submission failure
        handleInfo({ code: 100403 });
        const now = new Date().toISOString();
        setAttempts((prev) => {
          const newAttempts = prev + 1;
          // Update cookie with new attempt count
          cookieHandler.setLoginAttempts(newAttempts, null, now);
          if (newAttempts >= 3) {
            updateLockoutMessage(now);
          } else {
            setError(`Unsuccessful attempt ${newAttempts} of 3.`);
          }
          return newAttempts;
        });
      }
    } catch (err) {
      // Handle errors during consent submission
      handleInfo({ code: 100402, error: err });
    }
    setLoading(false);
  };

  /**
   * Requests email reset code
   * @param {Object} formData - Reset form data
   * @param {string} formData.email - User's email
   * @param {string} formData.mobileNumber - User's mobile number
   */
  const handleEmailRequest = async (formData: {
    email: string;
    mobileNumber: string;
  }) => {
    try {
      setLoading(true);
      // Ensure UI updates before async operations
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // Request login reset with cleaned mobile number
      const resetResponse = await emailService.resetLogin({
        mobileNumber: formData.mobileNumber.replaceAll("-", ""),
        email: formData.email,
      });

      // Handle successful reset request
      if (resetResponse.status === "SUCCESS") {
        setEmailSent(true);
        // Update form data with cleaned mobile number
        setFormData({
          email: formData.email,
          mobileNumber: formData.mobileNumber.replaceAll("-", ""),
        });
        handleInfo({ code: 100404 });
      } else {
        // Handle reset request failure
        handleInfo({ code: 100405 });
      }
    } catch (err) {
      // Handle errors during reset request
      handleInfo({ code: 100402, error: err });
    }
    setLoading(false);
  };

  /**
   * Resets component state
   */
  const resetState = () => {
    // Clear email sent and verification status
    setEmailSent(false);
    setIsEmailCodeVerified(false);
    // Reset form data
    setFormData({ email: "", mobileNumber: "" });
    // Clear error and attempts
    setError("");
    setAttempts(0);
    // Clear login attempts in cookies
    cookieHandler.clearLoginAttempts();
  };

  /**
   * Toggles between login and reset views, optionally updating email
   * @param {boolean} isVisible - Whether to show login view
   * @param {string} [email] - Optional email to set
   */
  const handleLoginResetSwitch = (isVisible: boolean, email?: string) => {
    // Toggle login/reset view
    setShowLogin(isVisible);
    // Update email in form data if provided
    if (email !== undefined) {
      setFormData((prev) => ({ ...prev, email }));
    }
  };

  /**
   * Updates email in form data
   * @param {string} email - New email value
   */
  const handleEmailChange = (email: string) => {
    // Update email in form data
    setFormData((prev) => ({ ...prev, email }));
  };

  return (
    <div className="flex flex-col custom:flex-row custom:gap-4 mt-4 custom:mt-0 min-h-screen py-4 items-center custom:items-start justify-center">
      {/* Workflow card section */}
      <div className="w-[408px] max-w-full flex justify-center mb-4 max-xs:order-2 custom:mb-0">
        <WorkflowCard />
      </div>
      {/* Login or reset card section */}
      <div className="w-[408px] custom:w-full max-w-full custom:flex-1 flex max-xs:order-1 mb-4 justify-center">
        {showLogin && (
          <LoginCard
            onSubmit={handleLogin}
            isSubmitting={isLoading}
            error={error}
            attempts={attempts}
            setShowLogin={handleLoginResetSwitch}
            email={formData.email}
            onEmailChange={handleEmailChange}
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
            onCancel={resetState}
            setShowLogin={handleLoginResetSwitch}
            defaultData={formData}
            onEmailChange={handleEmailChange}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Main login page component with suspense fallback
 * @returns {JSX.Element} The login page with suspense wrapper
 */
const LoginPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;
