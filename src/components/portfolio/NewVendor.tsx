import React, { useState, useEffect } from "react";

import { CustomInput } from "@/components/ui/CustomInput";
import { NewVendorFormData } from "@/types/vendor";
import { SectionHeader } from "@/components/ui/SectionHeader";
import PixieButton from "@/components/buttons/PixieButton";
import CancelButton from "@/components/buttons/CancelButton";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";

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
      <div className="bg-white rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <SectionHeader
              title="Create Vendor"
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

            <CustomInput
              label="Company Address"
              value={formData.companyAddress}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, companyAddress: value }))
              }
              isEditing={true}
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

            <div className="grid grid-cols-2 gap-4">
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
              />

              <CustomCheckbox
                id="send1099"
                checked={formData.send1099}
                onChange={() => handleCheckboxChange("send1099")}
                label="Send 1099"
              />

              <CustomCheckbox
                id="getInsuranceCert"
                checked={formData.getInsuranceCert}
                onChange={() => handleCheckboxChange("getInsuranceCert")}
                label="Get insurance certificate"
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-200 flex-shrink-0">
          <div className="flex flex-col gap-3">
            <PixieButton
              label="Create Vendor"
              disabled={false}
              type="submit"
              formId="new-vendor-form"
            />
            <CancelButton onClick={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
};
