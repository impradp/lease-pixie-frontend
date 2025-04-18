"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Account } from "@/types/Account";
import handleInfo from "@/lib/utils/errorHandler";
import LinkButton from "@/components/ui/buttons/LinkButton";
import CustomInput from "@/components/ui/input/CustomInput";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { SectionHeader } from "@/components/ui/header/SectionHeader";

// Dynamically import AddressAutocompleteInput with SSR disabled
const AddressAutocompleteInput = dynamic(
  () =>
    import("@/components/ui/addressAutoCompleteInput/AddressAutoCompleteInput"),
  {
    ssr: false,
    loading: () => <p>Loading address input...</p>,
  }
);

/**
 * Props for the AccountForm component
 */
interface AccountFormProps {
  onClose: () => void; // Callback to close the form
  onSubmit: (
    userData: Account,
    setLoading: (loading: boolean) => void
  ) => Promise<void>; // Callback to submit form data
  disabled?: boolean; // Whether the form is disabled (default: false)
  data: Account; // Initial account data
  isEditForm?: boolean; // Whether this is an edit form (default: false)
}

/**
 * Renders a form for creating or editing an account
 * @param props - The properties for configuring the form
 * @returns JSX.Element - The rendered account form
 */
const AccountForm: React.FC<AccountFormProps> = ({
  onClose,
  onSubmit,
  disabled = false,
  data,
  isEditForm = false,
}) => {
  const [formData, setFormData] = useState<Account>(data); // State for form data
  const [isLoading, setIsLoading] = useState(false); // State for form submission loading
  const isFormDisabled = isLoading || disabled; // Combined disabled state

  const isReadonly = isEditForm;

  // Effect to manage body overflow and scrollbar padding
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
      formData?.companyName?.trim() &&
      formData?.address?.trim() &&
      formData?.contactFirstName?.trim() &&
      formData?.contactLastName?.trim() &&
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
          mobileNumber: formData?.mobileNumber?.replaceAll("-", ""),
          officePhoneNumber: formData?.officePhoneNumber?.replaceAll("-", ""),
        },
        setIsLoading
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsLoading(false);
    }
  };

  /**
   * Updates form data for a specific field
   * @param field - The field to update
   * @param value - The new value for the field
   */
  const handleInputChange = (field: keyof Account, value: string) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <SectionHeader
              title={isEditForm ? "Update Account" : "Create Account"}
              showCloseButton={true}
              onClose={handleClose}
            />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <CustomInput
              label="Company"
              value={formData.companyName ?? ""}
              onChange={(value) => handleInputChange("companyName", value)}
              isEditing={true}
              disabled={isFormDisabled}
              isRequired={true}
            />
            <AddressAutocompleteInput
              label="Address"
              value={formData.address ?? ""}
              onChange={(value) => handleInputChange("address", value)}
              isEditing={true}
              placeholder="Start typing address..."
              inputId="company-address-input"
              disabled={isFormDisabled}
              isRequired={true}
            />
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="First name"
                value={formData.contactFirstName ?? ""}
                onChange={(value) =>
                  handleInputChange("contactFirstName", value)
                }
                isEditing={true}
                disabled={isFormDisabled}
                isRequired={true}
              />
              <CustomInput
                label="Last name"
                value={formData.contactLastName ?? ""}
                onChange={(value) =>
                  handleInputChange("contactLastName", value)
                }
                isEditing={true}
                disabled={isFormDisabled}
                isRequired={true}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Office phone"
                value={formData.officePhoneNumber ?? ""}
                onChange={(value) =>
                  handleInputChange("officePhoneNumber", value)
                }
                isEditing={true}
                placeholder="800-555-1234"
                type="mobile"
                disabled={isFormDisabled}
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
            <div className="flex flex-col gap-3">
              <PixieButton
                label={isEditForm ? "Update" : "Add Account"}
                disabled={isFormDisabled}
                type="submit"
                isLoading={isLoading}
              />
              <LinkButton onClick={handleClose} disabled={isFormDisabled} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountForm;
