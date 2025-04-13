"use client";

import React, { useState, useEffect } from "react";
import { Locale } from "@/locales";
import { getMessages } from "@/locales/locale";
import { NewUserFormData } from "@/types/user";
import PixieButton from "@/components/ui/buttons/PixieButton";
import LinkButton from "@/components/ui/buttons/LinkButton";
import CustomInput from "@/components/ui/input/CustomInput";
import { SectionHeader } from "@/components/ui/header/SectionHeader";
import { CustomCheckbox } from "@/components/ui/input/CustomCheckbox";
import ConfirmationDialog from "@/components/ui/dialog/ConfirmationDialog";

/**
 * Props for the NewReadOnlyAdminUser component
 */
interface NewReadOnlyAdminUserProps {
  onClose: () => void; // Callback to close the modal
  onSubmit: (userData: NewUserFormData) => void; // Callback to submit new user data
}

/**
 * Renders a modal form to create a new read-only admin user
 * @param props - The properties for configuring the modal
 * @returns JSX.Element - The rendered new user modal
 */
const NewReadOnlyAdminUser: React.FC<NewReadOnlyAdminUserProps> = ({
  onClose,
  onSubmit,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<NewUserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    mobilePhone: "",
    smsActive: false,
  });

  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);

  // Manage body overflow and scrollbar padding
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setShowConfirmation(true);
  };

  // Handle confirmation dialog close
  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    onClose();
  };

  // Handle checkbox change
  const handleCheckboxChange = (value: boolean) => {
    setFormData((prev) => ({ ...prev, smsActive: value }));
  };

  // Handle input field changes
  const handleInputChange = (field: keyof NewUserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6">
          <SectionHeader
            title="Create Read-Only Admin User"
            showCloseButton={true}
            onClose={onClose}
          />
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="First name"
                value={formData.firstName}
                onChange={(value) => handleInputChange("firstName", value)}
                isEditing={true}
              />
              <CustomInput
                label="Last name"
                value={formData.lastName}
                onChange={(value) => handleInputChange("lastName", value)}
                isEditing={true}
              />
            </div>
            <CustomInput
              label="Email"
              value={formData.email}
              onChange={(value) => handleInputChange("email", value)}
              isEditing={true}
            />
            <CustomInput
              label="Mobile phone"
              value={formData.mobilePhone} // Fixed to match field name
              onChange={(value) => handleInputChange("mobilePhone", value)}
              isEditing={true}
            />
            <CustomCheckbox
              id="smsActive"
              checked={formData.smsActive ?? false}
              onChange={handleCheckboxChange}
              label="SMS Active"
              isEditing={true}
            />
            <div className="flex flex-col gap-3">
              <PixieButton label="Create User" disabled={false} type="submit" />
              <LinkButton onClick={onClose} />
            </div>
          </form>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
        title={messages?.portfolio?.user?.confirmModal?.title ?? "User Added"}
        message={
          messages?.portfolio?.user?.confirmModal?.message ??
          "The user has been successfully added."
        }
      />
    </>
  );
};

export default NewReadOnlyAdminUser;
