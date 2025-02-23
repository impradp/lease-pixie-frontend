import React, { useState } from "react";
import { CustomInput } from "@/components/ui/CustomInput";
import { NewUserFormData } from "@/types/user";
import { SectionHeader } from "@/components/ui/SectionHeader";
import PixieButton from "@/components/buttons/PixieButton";
import CancelButton from "@/components/buttons/CancelButton";

interface NewPortfolioUserProps {
  onClose: () => void;
  onSubmit: (userData: NewUserFormData) => void;
}

export const NewPortfolioUser: React.FC<NewPortfolioUserProps> = ({
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<NewUserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    mobilePhone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <SectionHeader
              title="Create Portfolio User"
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
              <PixieButton label="Create User" disabled={false} type="submit" />
              <CancelButton onClick={onClose} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
