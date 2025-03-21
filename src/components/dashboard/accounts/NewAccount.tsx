import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { Account } from "@/types/Account";
import PixieButton from "@/components/ui/buttons/PixieButton";
import CancelButton from "@/components/ui/buttons/CancelButton";
import { CustomInput } from "@/components/ui/input/CustomInput";
import { SectionHeader } from "@/components/ui/header/SectionHeader";

const AddressAutocompleteInput = dynamic(
  () =>
    import("@/components/ui/addressAutoCompleteInput/AddressAutoCompleteInput"),
  {
    ssr: false, // Disable SSR since it uses client-side Radar SDK
    loading: () => <p>Loading address input...</p>, // Optional fallback
  }
);

interface NewAccountProps {
  onClose: () => void;
  onSubmit: (userData: Account) => void;
}

export const NewAccount: React.FC<NewAccountProps> = ({
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Account>({
    company: "",
    companyAddress: "",
    firstName: "",
    lastName: "",
    email: "",
    officePhone: "",
    mobilePhone: "",
  });

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
                value={formData.company}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, company: value }))
                }
                isEditing={true}
              />
              <AddressAutocompleteInput
                label="Address"
                value={formData.companyAddress}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, companyAddress: value }))
                }
                isEditing={true}
                placeholder="Start typing address..."
                inputId="company-address-input"
              />
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
              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  label="Office phone"
                  value={formData.officePhone}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, officePhone: value }))
                  }
                  isEditing={true}
                  placeholder="800-555-1234"
                />
                <CustomInput
                  label="Mobile phone"
                  value={formData.mobilePhone}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, mobilePhone: value }))
                  }
                  isEditing={true}
                  placeholder="800-555-1234"
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

              <div className="flex flex-col gap-3">
                <PixieButton
                  label={"Add Vendor"}
                  disabled={false}
                  type={"submit"}
                />
                <CancelButton onClick={onClose} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
