"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginService } from "@/lib/services/login";
import LoginCard from "@/components/login/LoginCard";
import { getDefaultPage } from "@/config/roleAccess";
import { ToastrMessage } from "@/types/ToastrMessage";
import Toastr from "@/components/ui/toastrPopup/Toastr";
import { cookieHandler } from "@/lib/services/cookieHandler";
import WorkflowCard from "@/components/workflows/WorkflowCard";
import { LoadingContext } from "@/components/ClientLoadingWrapper";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setLoading, isLoading } = useContext(LoadingContext);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [toastrs, setToastrs] = useState<ToastrMessage[]>([]);
  const hasShownLogoutToastr = useRef(false);

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

  const handleLogin = async (formData: {
    email: string;
    identifier: string;
    otp: string;
  }) => {
    try {
      setLoading(true); // Set loading immediately
      await new Promise((resolve) => requestAnimationFrame(resolve)); // Ensure UI updates

      const response = await loginService.login({
        loginId: formData.identifier,
        totpSecret: formData.otp,
        email: formData.email,
      });

      if (response.status === "SUCCESS") {
        const now = new Date().toISOString();
        cookieHandler.setLoginAttempts(0, now, null, 86400);
        router.push(getDefaultPage()); // Trigger redirection (ClientLoadingWrapper will handle loading state)
      } else {
        const toastrId = `toastr-${Date.now()}-${Math.random()}`;
        setToastrs((prev) => [
          ...prev,
          { id: toastrId, message: "Login failed.", toastrType: "warning" },
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
        setLoading(false); // Clear loading on failure
      }
    } catch {
      const toastrId = `toastr-${Date.now()}-${Math.random()}`;
      setToastrs((prev) => [
        ...prev,
        { id: toastrId, message: "Login failed.", toastrType: "warning" },
      ]);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false); // Clear loading on error
    }
  };

  const handleToastrClose = (id: string) => {
    setToastrs((prev) => prev.filter((toastr) => toastr.id !== id));
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
        <LoginCard
          onSubmit={handleLogin}
          isSubmitting={isLoading}
          error={error}
          attempts={attempts}
        />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginContent />;
}
