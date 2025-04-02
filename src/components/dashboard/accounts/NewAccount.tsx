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
}

export const NewAccount: React.FC<NewAccountProps> = ({
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Account>({
    accountCompany: "",
    accountContactFirstName: "",
    accountContactLastName: "",
    accountEmail: "",
    accountAddress: "",
    phoneNumber: "",
    officePhone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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
      formData.accountCompany.trim() &&
      formData.accountAddress.trim() &&
      formData.accountContactFirstName.trim() &&
      formData.accountContactLastName.trim() &&
      formData.accountEmail.trim() &&
      formData.phoneNumber.trim();

    return !!isValid;
  };

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
      await onSubmit(
        { ...formData, phoneNumber: formData?.phoneNumber.replaceAll("-", "") },
        setIsLoading
      );
    } catch {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Account, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-lg mx-4">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <SectionHeader
                title={"Create Account"}
                showCloseButton={true}
                onClose={onClose}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <CustomInput
                label="Company"
                value={formData.accountCompany}
                onChange={(value) => handleInputChange("accountCompany", value)}
                isEditing={true}
                disabled={isLoading}
                isRequired={true}
              />
              <AddressAutocompleteInput
                label="Address"
                value={formData.accountAddress}
                onChange={(value) => handleInputChange("accountAddress", value)}
                isEditing={true}
                placeholder="Start typing address..."
                inputId="company-address-input"
                disabled={isLoading}
                isRequired={true}
              />
              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  label="First name"
                  value={formData.accountContactFirstName}
                  onChange={(value) =>
                    handleInputChange("accountContactFirstName", value)
                  }
                  isEditing={true}
                  disabled={isLoading}
                  isRequired={true}
                />
                <CustomInput
                  label="Last name"
                  value={formData.accountContactLastName}
                  onChange={(value) =>
                    handleInputChange("accountContactLastName", value)
                  }
                  isEditing={true}
                  disabled={isLoading}
                  isRequired={true}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  label="Office phone"
                  value={formData.officePhone}
                  onChange={(value) => handleInputChange("officePhone", value)}
                  isEditing={true}
                  placeholder="800-555-1234"
                  disabled={isLoading}
                />
                <CustomInput
                  label="Mobile phone"
                  value={formData.phoneNumber}
                  onChange={(value) => handleInputChange("phoneNumber", value)}
                  isEditing={true}
                  placeholder="800-555-1234"
                  type="mobile"
                  disabled={isLoading}
                  isRequired={true}
                />
              </div>

              <CustomInput
                label="Email"
                value={formData.accountEmail}
                onChange={(value) => handleInputChange("accountEmail", value)}
                isEditing={true}
                type="email"
                disabled={isLoading}
                isRequired={true}
              />

              <div className="flex flex-col gap-3">
                <PixieButton
                  label={"Add Account"}
                  disabled={isLoading}
                  type={"submit"}
                  isLoading={isLoading}
                />
                <CancelButton onClick={onClose} disabled={isLoading} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
