"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import WorkflowCard from "@/components/workflows/WorkflowCard";
import LoginCard from "@/components/login/LoginCard";

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (formData: {
    email: string;
    identifier: string;
  }) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      if (formData?.identifier.startsWith("U")) {
        router.push("/portfolio");
      } else {
        router.push("/workflows");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col custom:flex-row custom:gap-4 mt-4 custom:mt-0 min-h-screen py-4 items-center custom:items-start justify-center">
      <div className="w-[400px] max-w-full flex justify-center mb-4 custom:mb-0">
        <WorkflowCard />
      </div>
      <div className="w-[400px] custom:w-full max-w-full custom:flex-1 flex justify-center">
        <LoginCard onSubmit={handleLogin} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
