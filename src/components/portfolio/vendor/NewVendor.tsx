import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { Locale } from "@/locales";
import { getMessages } from "@/locales/loader";
import { NewVendorFormData } from "@/types/vendor";
import CustomInput from "@/components/ui/input/CustomInput";
import PixieButton from "@/components/ui/buttons/PixieButton";
import CancelButton from "@/components/ui/buttons/CancelButton";
import { SectionHeader } from "@/components/ui/header/SectionHeader";
import { CustomCheckbox } from "@/components/ui/input/CustomCheckbox";

const AddressAutocompleteInput = dynamic(
  () =>
    import("@/components/ui/addressAutoCompleteInput/AddressAutoCompleteInput"),
  {
    ssr: false, // Disable SSR since it uses client-side Radar SDK
    loading: () => <p>Loading address input...</p>, // Optional fallback
  }
);

interface NewVendorProps {
  onClose: () => void;
  onSubmit: (userData: NewVendorFormData) => void;
}

export const NewVendor: React.FC<NewVendorProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<NewVendorFormData>({
    companyName: "",
    serviceDescripton: "",
    companyAddress: "",
    officePhoneNumber: "",
    vendorFirstName: "",
    vendorLastName: "",
    vendorEmailId: "",
    vendorMobileNumber: "",
    getW9: false,
    send1099: false,
    getInsuranceCert: false,
  });

  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);

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
    onClose();
  };

  const handleCheckboxChange = (field: keyof NewVendorFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="p-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <SectionHeader
              title={messages?.portfolio?.vendor?.modal?.title}
              showCloseButton={true}
              onClose={onClose}
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6">
          <form
            id="new-vendor-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <CustomInput
              label="Company Name"
              value={formData.companyName}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, companyName: value }))
              }
              isEditing={true}
            />

            <CustomInput
              label="Service description (40 character limit)"
              value={formData.serviceDescripton}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, serviceDescripton: value }))
              }
              isEditing={true}
              placeholder="i.e. Electrician"
            />

            <AddressAutocompleteInput
              label="Company Address"
              value={formData.companyAddress}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, companyAddress: value }))
              }
              isEditing={true}
              placeholder="Start typing address..."
              inputId="company-address-input"
            />

            <CustomInput
              label="Office phone number"
              value={formData.officePhoneNumber}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, officePhoneNumber: value }))
              }
              isEditing={true}
              placeholder="800-555-1234"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                label="Vendor contact first name"
                value={formData.vendorFirstName}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, vendorFirstName: value }))
                }
                isEditing={true}
                placeholder="First"
              />

              <CustomInput
                label="Vendor contact last name"
                value={formData.vendorLastName}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, vendorLastName: value }))
                }
                isEditing={true}
                placeholder="Last"
              />
            </div>

            <CustomInput
              label="Email address"
              value={formData.vendorEmailId}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, vendorEmailId: value }))
              }
              isEditing={true}
            />

            <CustomInput
              label="Mobile phone number"
              value={formData.vendorMobileNumber}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, vendorMobileNumber: value }))
              }
              isEditing={true}
              placeholder="800-555-1234"
            />

            <div className="space-y-4 pt-2">
              <CustomCheckbox
                id="getW9"
                checked={formData.getW9}
                onChange={() => handleCheckboxChange("getW9")}
                label="Get W-9"
                isEditing={true}
              />

              <CustomCheckbox
                id="send1099"
                checked={formData.send1099}
                onChange={() => handleCheckboxChange("send1099")}
                label="Send 1099"
                isEditing={true}
              />

              <CustomCheckbox
                id="getInsuranceCert"
                checked={formData.getInsuranceCert}
                onChange={() => handleCheckboxChange("getInsuranceCert")}
                label="Get insurance certificate"
                isEditing={true}
              />
            </div>
            <div className="flex flex-col gap-3 pb-6">
              <PixieButton
                label={messages?.portfolio?.vendor?.modal?.button?.label}
                disabled={false}
                type={messages?.portfolio?.vendor?.modal?.button?.type}
                formId="new-vendor-form"
              />
              <CancelButton onClick={onClose} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
