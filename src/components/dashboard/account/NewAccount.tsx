import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import toastr from "@/lib/func/toastr";
import { Account } from "@/types/Account";
import CustomInput from "@/components/ui/input/CustomInput";
import PixieButton from "@/components/ui/buttons/PixieButton";
import CancelButton from "@/components/ui/buttons/CancelButton";
import { SectionHeader } from "@/components/ui/header/SectionHeader";

const AddressAutocompleteInput = dynamic(
  () =>
    import("@/components/ui/addressAutoCompleteInput/AddressAutoCompleteInput"),
  {
    ssr: false,
    loading: () => <p>Loading address input...</p>,
  }
);

interface NewAccountProps {
  onClose: () => void;
  onSubmit: (
    userData: Account,
    setLoading: (loading: boolean) => void
  ) => Promise<void>;
  disabled?: boolean; // Added disabled prop
}

export const NewAccount: React.FC<NewAccountProps> = ({
  onClose,
  onSubmit,
  disabled = false, // Default to false
}) => {
  const [formData, setFormData] = useState<Account>({
    companyName: "",
    contactFirstName: "",
    contactLastName: "",
    email: "",
    address: "",
    mobileNumber: "",
    officePhoneNumber: "",
    portfolioList: [],
    services: [],
    actions: [],
    isAccessLocked: false,
    invoices: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  // Combine component's internal loading state with parent's disabled state
  const isFormDisabled = isLoading || disabled;

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

  const validateForm = (): boolean => {
    // Only check if required fields are empty, don't store specific errors
    const isValid =
      formData.companyName.trim() &&
      formData.address.trim() &&
      formData.contactFirstName.trim() &&
      formData.contactLastName.trim() &&
      formData.email.trim() &&
      formData.mobileNumber.trim();

    return !!isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if form is already disabled
    if (isFormDisabled) return;

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
      await onSubmit(
        {
          ...formData,
          mobileNumber: formData?.mobileNumber.replaceAll("-", ""),
          officePhoneNumber: formData?.officePhoneNumber.replaceAll("-", ""),
        },
        setIsLoading
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Account, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle close with disabled state check
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
              title={"Create Account"}
              showCloseButton={true}
              onClose={handleClose}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <CustomInput
              label="Company"
              value={formData.companyName}
              onChange={(value) => handleInputChange("companyName", value)}
              isEditing={true}
              disabled={isFormDisabled}
              isRequired={true}
            />
            <AddressAutocompleteInput
              label="Address"
              value={formData.address}
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
                value={formData.contactFirstName}
                onChange={(value) =>
                  handleInputChange("contactFirstName", value)
                }
                isEditing={true}
                disabled={isFormDisabled}
                isRequired={true}
              />
              <CustomInput
                label="Last name"
                value={formData.contactLastName}
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
                value={formData.officePhoneNumber}
                onChange={(value) =>
                  handleInputChange("officePhoneNumber", value)
                }
                isEditing={true}
                placeholder="800-555-1234"
                type="mobile"
                disabled={isFormDisabled}
                isRequired={true}
              />
              <CustomInput
                label="Mobile phone"
                value={formData.mobileNumber}
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
              value={formData.email}
              onChange={(value) => handleInputChange("email", value)}
              isEditing={true}
              type="email"
              disabled={isFormDisabled}
              isRequired={true}
            />

            <div className="flex flex-col gap-3">
              <PixieButton
                label={"Add Account"}
                disabled={isFormDisabled}
                type={"submit"}
                isLoading={isLoading}
              />
              <CancelButton onClick={handleClose} disabled={isFormDisabled} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
