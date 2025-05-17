"use client";

import Image from "next/image";
import { useState, useContext, useEffect } from "react";

import CustomInput from "@/components/ui/input/CustomInput";
import PixieButton from "@/components/ui/buttons/PixieButton";
import AuthenticateForm from "@/components/login/AuthenticateForm";
import { LoadingContext } from "@/components/ClientLoadingWrapper";

/**
 * Props for the LoginCard component
 * @interface LoginCardProps
 */
interface LoginCardProps {
  /** Callback to handle form submission with email, identifier, and OTP */
  readonly onSubmit: (formData: {
    email: string;
    identifier: string;
    otp: string;
  }) => void;
  /** Indicates if the form is currently submitting */
  readonly isSubmitting: boolean;
  /** Initial authentication code, defaults to 6 empty strings */
  initialAuthCode?: string[];
  /** Optional error message to display */
  error?: string;
  /** Number of submission attempts, defaults to 0 */
  attempts?: number;
  /** Function to toggle login visibility and optionally pass email */
  setShowLogin: (isVisible: boolean, email?: string) => void;
  /** Initial email value, defaults to empty string */
  email?: string;
  /** Callback to report email changes to parent */
  onEmailChange?: (email: string) => void;
}

/**
 * A login card component for user authentication with email, identifier, and OTP
 * @param {LoginCardProps} props - Component properties
 * @returns {JSX.Element} The rendered login card
 */
function LoginCard({
  onSubmit,
  isSubmitting,
  initialAuthCode = ["", "", "", "", "", ""],
  error,
  attempts = 0,
  setShowLogin,
  email = "",
  onEmailChange = () => {},
}: LoginCardProps) {
  const { setLoading } = useContext(LoadingContext); // Access loading state from context
  const [formData, setFormData] = useState({
    email: email, // Initialize with passed email prop
    identifier: "", // User ID or Workflow ID
    otp: "", // One-time password
  });
  const [authCode, setAuthCode] = useState<string[]>(initialAuthCode); // State for 6-digit auth code
  const [showAuthForm, setShowAuthForm] = useState<boolean>(false); // Controls visibility of OTP form

  /**
   * Syncs local email state with prop changes
   */
  useEffect(() => {
    // Update local formData.email when email prop changes
    if (email !== formData.email) {
      setFormData((prev) => ({ ...prev, email }));
    }
  }, [email]);

  /**
   * Creates an input change handler for a specific form field
   * @param {keyof typeof formData} field - The form field to update
   * @returns {(value: string) => void} A function to handle input changes
   */
  const handleInputChange =
    (field: keyof typeof formData) => (value: string) => {
      // Update the specified field in formData
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Notify parent of email changes if field is email
      if (field === "email") {
        onEmailChange(value);
      }
    };

  /**
   * Handles form submission to show the OTP authentication form
   * @param {React.FormEvent<HTMLFormElement>} e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default form submission
    e.preventDefault();

    // Show the authentication form for OTP input
    setShowAuthForm(true);
  };

  /**
   * Handles submission of the authentication code
   * @param {string} authCode - The 6-digit authentication code
   */
  const handleAuthCodeSubmit = (authCode: string) => {
    // Hide the authentication form
    setShowAuthForm(false);

    // Activate loading state
    setLoading(true);

    // Update authCode state with individual digits
    setAuthCode(authCode.split(""));

    // Submit form data with OTP to parent component
    onSubmit({ ...formData, otp: authCode });

    // Reset authCode to initial state
    setAuthCode(initialAuthCode);
  };

  /**
   * Switches to the reset page, passing the current email
   * @param {React.MouseEvent<HTMLSpanElement>} e - Click event
   */
  const switchToReset = (e: React.MouseEvent<HTMLSpanElement>) => {
    // Prevent default link behavior
    e.preventDefault();

    // Hide login and pass current email to reset page
    setShowLogin(false, formData.email);
  };

  return (
    <div className="w-full h-[1262px] max-xs:h-[932px] bg-tertiary-ghostWhite/50 border border-tertiary-fill rounded-[10px] flex flex-col items-center pt-14 relative">
      <div className="w-full flex flex-col justify-center items-center">
        {/* Security shield logo */}
        <Image
          src="/security-shield.svg"
          alt="Logo"
          width={100}
          height={100}
          priority
        />
        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="self-stretch flex flex-col justify-end items-end"
        >
          {/* Form title */}
          <div className="w-full flex flex-col items-center py-7">
            <h1 className="w-full text-center text-tertiary-deepNavy text-xl sm:text-2xl md:text-3xl font-semibold font-['Inter'] leading-tight sm:leading-8 md:leading-[38px]">
              Log in to your account
            </h1>
          </div>

          {/* Input fields and submit button */}
          <div className="self-stretch flex flex-col justify-center items-center gap-4">
            <CustomInput
              label="Email"
              value={formData.email}
              onChange={handleInputChange("email")}
              placeholder="Enter your email"
              isEditing={true}
              containerClassName="h-[91px] w-[358px]"
              type="email"
              isRequired={true}
            />

            <CustomInput
              label="User ID or Workflow ID"
              value={formData.identifier}
              onChange={handleInputChange("identifier")}
              placeholder="Enter your ID"
              isEditing={true}
              containerClassName="w-[358px]"
              type="password"
              isRequired={true}
            />

            {/* Generate User ID link */}
            <div className="w-[358px] flex flex-col justify-center items-end ">
              <button
                className="text-secondary-light text-sm font-normal font-['Inter'] underline cursor-pointer"
                onClick={switchToReset}
              >
                New User ID
              </button>
            </div>

            {/* Submit button */}
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
            </div>
          </div>
        </form>
      </div>
      {/* Conditional OTP authentication form */}
      {showAuthForm && (
        <div className="absolute top-40 left-0 right-0 flex justify-center z-50">
          <AuthenticateForm
            onClose={() => setShowAuthForm(false)}
            onSubmitCode={handleAuthCodeSubmit}
            initialCode={authCode}
            className="w-full max-w-[358px] min-w-[280px]"
          />
        </div>
      )}
    </div>
  );
}

export default LoginCard;
