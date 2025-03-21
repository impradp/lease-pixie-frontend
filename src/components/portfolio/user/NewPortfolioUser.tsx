import React, { useState, useEffect } from "react";
import { CustomInput } from "@/components/ui/input/CustomInput";
import { NewUserFormData } from "@/types/user";
import { SectionHeader } from "@/components/ui/header/SectionHeader";
import PixieButton from "@/components/ui/buttons/PixieButton";
import CancelButton from "@/components/ui/buttons/CancelButton";
import ConfirmationDialog from "@/components/ui/dialog/ConfirmationDialog";
import { getMessages } from "@/locales/loader";
import { Locale } from "@/locales";

interface NewPortfolioUserProps {
  onClose: () => void;
  onSubmit: (userData: NewUserFormData) => void;
}

export const NewPortfolioUser: React.FC<NewPortfolioUserProps> = ({
  onClose,
  onSubmit,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<NewUserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    mobilePhone: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setShowConfirmation(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-lg mx-4">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <SectionHeader
                title={messages?.portfolio?.user?.modal?.title}
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
                />
                <CustomInput
                  label="Last name"
                  value={formData.lastName}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, lastName: value }))
                  }
                  isEditing={true}
                />
              </div>

              <CustomInput
                label="Email"
                value={formData.email}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, email: value }))
                }
                isEditing={true}
              />

              <CustomInput
                label="Mobile phone"
                value={formData.mobilePhone}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, mobilePhone: value }))
                }
                isEditing={true}
              />

              <div className="pt-4 flex flex-col gap-3">
                <PixieButton
                  label={messages?.portfolio?.user?.modal?.button?.label}
                  disabled={false}
                  type={messages?.portfolio?.user?.modal?.button?.type}
                />
                <CancelButton onClick={onClose} />
              </div>
            </form>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
        title={messages?.portfolio?.user?.confirmModal?.title}
        message={messages?.portfolio?.user?.confirmModal?.message}
      />
    </>
  );
};
