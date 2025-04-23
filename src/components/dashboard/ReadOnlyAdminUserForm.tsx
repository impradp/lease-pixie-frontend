"use client";

import React, { useState, useEffect } from "react";

import { NewUserFormData } from "@/types/user";
import handleInfo from "@/lib/utils/errorHandler";
import LinkButton from "@/components/ui/buttons/LinkButton";
import CustomInput from "@/components/ui/input/CustomInput";
import { ReadOnlyAdminUser } from "@/types/ReadOnlyAdminUser";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { SectionHeader } from "@/components/ui/header/SectionHeader";
import { CustomCheckbox } from "@/components/ui/input/CustomCheckbox";

/**
 * Props for the NewReadOnlyAdminUser component
 */
interface ReadOnlyAdminUserFormProps {
  onClose: () => void; // Callback to close the modal
  onSubmit: (
    userData: ReadOnlyAdminUser,
    setLoading: (loading: boolean) => void
  ) => Promise<void>; // Callback to submit form data
  disabled?: boolean; // Whether the form is disabled (default: false)
  isEditForm?: boolean; // Whether this is an edit form (default: false)
  data: ReadOnlyAdminUser; // Initial account data
}

/**
 * Renders a modal form to create a new read-only admin user
 * @param props - The properties for configuring the modal
 * @returns JSX.Element - The rendered new user modal
 */
const ReadOnlyAdminUserForm: React.FC<ReadOnlyAdminUserFormProps> = ({
  onClose,
  onSubmit,
  disabled = false,
  isEditForm = false,
  data,
}) => {
  const [formData, setFormData] = useState<ReadOnlyAdminUser>(data);

  const [isLoading, setIsLoading] = useState(false); // State for form submission loading
  const isFormDisabled = isLoading || disabled; // Combined disabled state

  const isReadonly = isEditForm;

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

  /**
   * Validates the form data for required fields
   * @returns boolean - Whether the form is valid
   */
  const validateForm = (): boolean => {
    const isValid =
      formData?.firstName?.trim() &&
      formData?.lastName?.trim() &&
      formData?.email?.trim() &&
      formData?.mobileNumber?.trim();
    return !!isValid;
  };

  /**
   * Handles form submission
   * @param e - The form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormDisabled) return;

    if (!validateForm()) {
      handleInfo({ code: 100000 });
      return;
    }

    try {
      setIsLoading(true);
      await new Promise((resolve) => requestAnimationFrame(resolve)); // Simulate async operation
      await onSubmit(
        {
          ...formData,
          mobileNumber: formData?.mobileNumber.replaceAll("-", ""),
        },
        setIsLoading
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsLoading(false);
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (value: boolean) => {
    setFormData((prev) => ({ ...prev, smsActive: value }));
  };

  // Handle input field changes
  const handleInputChange = (field: keyof NewUserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Handles form close action
   */
  const handleClose = () => {
    if (!isFormDisabled) {
      onClose();
    }
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
                value={formData.firstName ?? ""}
                onChange={(value) => handleInputChange("firstName", value)}
                isEditing={true}
                disabled={isFormDisabled}
                isRequired={true}
              />
              <CustomInput
                label="Last name"
                value={formData.lastName ?? ""}
                onChange={(value) => handleInputChange("lastName", value)}
                isEditing={true}
                disabled={isFormDisabled}
                isRequired={true}
              />
            </div>
            <CustomInput
              label="Email"
              value={formData.email ?? ""}
              onChange={(value) => handleInputChange("email", value)}
              isEditing={true}
              type="email"
              disabled={isFormDisabled || isReadonly}
              isRequired={true}
            />
            <CustomInput
              label="Mobile phone"
              value={formData.mobileNumber ?? ""}
              onChange={(value) => handleInputChange("mobileNumber", value)}
              isEditing={true}
              placeholder="800-555-1234"
              type="mobile"
              disabled={isFormDisabled}
              isRequired={true}
            />
            <CustomCheckbox
              id="smsActive"
              checked={formData.smsActive ?? false}
              onChange={handleCheckboxChange}
              label="SMS Active"
              isEditing={true}
            />
            <div className="flex flex-col gap-3">
              <PixieButton
                label={isEditForm ? "Update" : "Create User"}
                disabled={isFormDisabled}
                type="submit"
                isLoading={isLoading}
              />
              <div className="flex justify-center">
                <LinkButton onClick={handleClose} disabled={isFormDisabled} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReadOnlyAdminUserForm;
