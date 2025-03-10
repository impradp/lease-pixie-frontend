"use client";

import Image from "next/image";
import { useState } from "react";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { CustomInput } from "@/components/ui/input/CustomInput";

interface LoginCardProps {
  readonly onSubmit: (formData: { email: string; identifier: string }) => void;
  readonly isSubmitting: boolean;
}

export default function LoginCard({ onSubmit, isSubmitting }: LoginCardProps) {
  const [formData, setFormData] = useState({
    email: "",
    identifier: "",
  });

  const handleInputChange =
    (field: keyof typeof formData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full h-[1262px] bg-tertiary-ghostWhite/50 border border-tertiary-fill rounded-[10px] flex flex-col items-center p-5 relative">
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
              className="h-[91px] w-[358px]"
            />

            <CustomInput
              label="User ID or Workflow ID"
              value={formData.identifier}
              onChange={handleInputChange("identifier")}
              placeholder="Enter your ID"
              isEditing={true}
              className="h-24 w-[358px]"
            />

            <PixieButton
              label={isSubmitting ? "Signing In..." : "Sign-In"}
              type="submit"
              disabled={isSubmitting || !formData.email || !formData.identifier}
              className="w-[358px]"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
