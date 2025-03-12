"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { userService } from "@/lib/services/user";
import { loginService } from "@/lib/services/login";
import LoginCard from "@/components/login/LoginCard";
import { ToastrMessage } from "@/types/ToastrMessage";
import Toastr from "@/components/ui/toastrPopup/Toastr";
import { cookieHandler } from "@/lib/services/cookieHandler";
import WorkflowCard from "@/components/workflows/WorkflowCard";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";

// Create a separate client component for search params logic
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [toastrs, setToastrs] = useState<ToastrMessage[]>([]);
  const hasShownLogoutToastr = useRef(false); // Track if logout toastr has been shown

  // Load cookie data and check for logout query parameter
  useEffect(() => {
    const loggedOut = searchParams.get("loggedOut");
    if (loggedOut === "true" && !hasShownLogoutToastr.current) {
      const toastrId = `toastr-${Date.now()}-${Math.random()}`;
      setToastrs((prev) => [
        ...prev,
        {
          id: toastrId,
          message: "Logged out successfully.",
          toastrType: "success",
        },
      ]);
      hasShownLogoutToastr.current = true;
      router.replace("/login");
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

  useEffect(() => {
    const checkAuth = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];

      if (!token) return;

      await userService
        .self()
        .then(() => {
          router.push("/workflows");
        })
        .catch(() => {
          // Token invalid, continue with login page
        });
    };

    checkAuth();
  }, [router]);

  const handleLogin = async (formData: {
    email: string;
    identifier: string;
    otp: string;
  }) => {
    setIsSubmitting(true);

    await loginService
      .login({
        loginId: formData.identifier,
        totp: formData.otp,
        email: formData.email,
      })
      .then((response) => {
        if (response.status === 1) {
          // Set redirecting state to show the loading overlay
          setIsRedirecting(true);

          // Reset attempts and store last successful login
          const now = new Date().toISOString();
          cookieHandler.setLoginAttempts(0, now, null, 86400); // 24 hours

          // Navigate to the workflows page after a small delay
          // to ensure the loading state is visible
          setTimeout(() => {
            router.push("/workflows?success=true");
          }, 300);
        } else {
          // Handle multiple retries
          const toastrId = `toastr-${Date.now()}-${Math.random()}`; // Unique ID for each toastr
          setToastrs((prev) => [
            ...prev,
            { id: toastrId, message: "Login failed.", toastrType: "warning" },
          ]);
          const now = new Date().toISOString();
          setAttempts((prev) => {
            const newAttempts = prev + 1;
            cookieHandler.setLoginAttempts(newAttempts, null, now); // 30 minutes
            if (newAttempts >= 3) {
              updateLockoutMessage(now);
            } else {
              setError(`Unsuccessful attempt ${newAttempts} of 3.`);
            }
            return newAttempts;
          });
        }
      })
      .catch(() => {
        const toastrId = `toastr-${Date.now()}-${Math.random()}`; // Unique ID for each toastr
        setToastrs((prev) => [
          ...prev,
          { id: toastrId, message: "Login failed.", toastrType: "warning" },
        ]);
        setError("An unexpected error occurred. Please try again.");
      })
      .finally(() => {
        // Only set isSubmitting to false if not redirecting
        if (!isRedirecting) {
          setIsSubmitting(false);
        }
      });
  };

  const handleToastrClose = (id: string) => {
    setToastrs((prev) => prev.filter((toastr) => toastr.id !== id));
  };

  const updateLockoutMessage = (lastFailedAttempt: string) => {
    const lockoutDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
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

  return (
    <div className="flex flex-col custom:flex-row custom:gap-4 mt-4 custom:mt-0 min-h-screen py-4 items-center custom:items-start justify-center">
      {/* Show loading overlay when redirecting after successful login */}
      {isRedirecting && <LoadingOverlay size={40} />}

      {toastrs.length > 0 && (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
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
        <LoginCard
          onSubmit={handleLogin}
          isSubmitting={isSubmitting}
          error={error}
          attempts={attempts}
        />
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    setIsPageLoading(false);
  }, []);

  // Show loading overlay during initial page load
  if (isPageLoading) {
    return <LoadingOverlay size={40} />;
  }

  return (
    <Suspense fallback={<LoadingOverlay size={40} />}>
      <LoginContent />
    </Suspense>
  );
}
