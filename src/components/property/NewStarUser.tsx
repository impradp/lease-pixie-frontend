import React, { useState, useEffect } from "react";

import { Locale } from "@/locales";
import toastr from "@/lib/func/toastr";
import { getMessages } from "@/locales/locale";
import { NewUserFormData } from "@/types/user";
import CustomInput from "@/components/ui/input/CustomInput";
import PixieButton from "@/components/ui/buttons/PixieButton";
import LinkButton from "@/components/ui/buttons/LinkButton";
import { SectionHeader } from "@/components/ui/header/SectionHeader";

interface NewStarUserProps {
  onClose: () => void;
  onSubmit: (
    userData: NewUserFormData,
    setLoading: (loading: boolean) => void
  ) => Promise<void>;
}

const NewStarUser: React.FC<NewStarUserProps> = ({ onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<NewUserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    mobilePhone: "",
    phoneNumber: "",
  });

  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);

  // Add the scroll lock with scrollbar width compensation
  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    const originalPadding = window.getComputedStyle(document.body).paddingRight;

    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.paddingRight = originalPadding;
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toastr({
        message: "Required fields (*) are empty.",
        toastrType: "error",
      });
      return;
    }
    try {
      setIsLoading(true);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      onSubmit({ ...formData }, setIsLoading);
    } catch {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    // Only check if required fields are empty, don't store specific errors
    const isValid =
      formData.email.trim() &&
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.mobilePhone.trim();

    return !!isValid;
  };

  const handleInputChange = (field: keyof NewUserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <SectionHeader
              title={"Create Property User"}
              showCloseButton={true}
              onClose={onClose}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="First name"
                value={formData.firstName}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, firstName: value }))
                }
                isEditing={true}
                disabled={isLoading}
                isRequired={true}
              />

              <CustomInput
                label="Last name"
                value={formData.lastName}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, lastName: value }))
                }
                isEditing={true}
                disabled={isLoading}
                isRequired={true}
              />
            </div>

            <CustomInput
              label="Email"
              value={formData.email}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, email: value }))
              }
              isEditing={true}
              disabled={isLoading}
              isRequired={true}
            />

            <CustomInput
              label="Mobile phone"
              value={formData.mobilePhone}
              onChange={(value) => handleInputChange("mobilePhone", value)}
              isEditing={true}
              placeholder="800-555-1234"
              type="mobile"
              disabled={isLoading}
              isRequired={true}
            />

            <div className="pt-4 flex flex-col gap-3">
              <PixieButton
                label={messages?.portfolio?.user?.modal?.button?.label}
                type={messages?.portfolio?.user?.modal?.button?.type}
                disabled={isLoading}
                isLoading={isLoading}
              />
              <LinkButton onClick={onClose} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewStarUser;
