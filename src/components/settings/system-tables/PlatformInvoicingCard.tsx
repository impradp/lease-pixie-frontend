import React, { useEffect, useState } from "react";
import CustomInput from "@/components/ui/input/CustomInput";
import PixieButton from "@/components/ui/buttons/PixieButton";
import LinkButton from "@/components/ui/buttons/LinkButton";
import SectionHeader from "@/components/ui/header/SectionHeader";
import { PlatformInvoicing } from "@/types/PlatformInvoicing";
import { samplePlatformInvoicing } from "@/data/platformInvoicing";

interface PlatformInvoicingCardProps {
  sectionName: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
  isSubmitting: (value: boolean) => void;
  isEditable: boolean;
}

const PlatformInvoicingCard: React.FC<PlatformInvoicingCardProps> = ({
  sectionName,
  editingSection,
  onSectionEdit,
  onSectionClose,
  isSubmitting,
  isEditable,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<PlatformInvoicing>(
    samplePlatformInvoicing
  );
  const [initialFormData, setInitialFormData] = useState<PlatformInvoicing>(
    samplePlatformInvoicing
  );

  useEffect(() => {
    setInitialFormData(samplePlatformInvoicing);
    setFormData(samplePlatformInvoicing);
  }, [samplePlatformInvoicing]);

  // Handle edit button click
  const handleEdit = () => {
    if (editingSection === null || editingSection === sectionName) {
      onSectionEdit(sectionName);
      setIsEditMode(true);
    }
  };

  // Handle cancel button click
  const handleTextClose = () => {
    setFormData(initialFormData); // Revert to initial values
    setIsEditMode(false);
    onSectionClose();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    isSubmitting(true);
    setIsEditMode(false);
    onSectionClose();
  };

  const isEditDisabled =
    editingSection !== null && editingSection !== sectionName;

  return (
    <div
      className={`rounded-xl p-6 ${
        isEditMode ? "bg-card-open-fill" : "bg-card-close-fill"
      }`}
    >
      <form
        id={`form-${sectionName}`}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <SectionHeader
          title={"Platform Invoicing"}
          editLabel={"View"}
          onEdit={handleEdit}
          onTextCancel={handleTextClose}
          showEditButton={!isEditMode}
          showTextCloseButton={isEditMode}
          editDisabled={isEditDisabled}
          closeLabel="Close"
        />

        <CustomInput
          label="Payment processor UUID"
          value={formData.paymentProcessorUUID}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, paymentProcessorUUID: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />

        <CustomInput
          label="Billing ID"
          value={formData.billingId}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, billingId: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Entity"
          value={formData.entity}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, entity: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Street"
          value={formData.street}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, street: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="City"
          value={formData.city}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, city: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="State"
          value={formData.state}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, state: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Zip code"
          value={formData.zipCode}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, zipCode: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Office phone"
          value={formData.officePhone}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, officePhone: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="E-mail address"
          value={formData.emailAddress}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, emailAddress: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Retail Base"
          value={formData.retailBase}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, retailBase: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Industrial Base"
          value={formData.industrialBase}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, industrialBase: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />

        {/* Show buttons only in edit mode */}
        {isEditMode && (
          <div className="flex flex-col gap-3">
            <PixieButton
              label={"Update"}
              type="submit"
              formId={`form-${sectionName}`}
              disabled={!isEditable}
              isLoading={!isEditable}
              className="w-full"
            />
            <div className="flex justify-center">
              <LinkButton onClick={handleTextClose} label="Cancel" />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PlatformInvoicingCard;
