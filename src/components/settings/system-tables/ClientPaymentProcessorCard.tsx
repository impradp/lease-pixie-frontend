import React, { useEffect, useState } from "react";
import CustomInput from "@/components/ui/input/CustomInput";
import PixieButton from "@/components/ui/buttons/PixieButton";
import LinkButton from "@/components/ui/buttons/LinkButton";
import SectionHeader from "@/components/ui/header/SectionHeader";
import { ClientPaymentProcessor } from "@/types/ClientPaymentProcessor";
import { sampleClientPaymentProcessor } from "@/data/clientPaymentProcessors";

interface ClientPaymentProcessorCardProps {
  sectionName: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
  isSubmitting: (value: boolean) => void;
  isEditable: boolean;
}

const ClientPaymentProcessorCard: React.FC<ClientPaymentProcessorCardProps> = ({
  sectionName,
  editingSection,
  onSectionEdit,
  onSectionClose,
  isSubmitting,
  isEditable,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<ClientPaymentProcessor>(
    sampleClientPaymentProcessor
  );
  const [initialFormData, setInitialFormData] =
    useState<ClientPaymentProcessor>(sampleClientPaymentProcessor);

  useEffect(() => {
    setInitialFormData(sampleClientPaymentProcessor);
    setFormData(sampleClientPaymentProcessor);
  }, [sampleClientPaymentProcessor]);

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
          title={"Client Payment Processors"}
          editLabel={"View"}
          onEdit={handleEdit}
          onTextCancel={handleTextClose}
          showEditButton={!isEditMode}
          showTextCloseButton={isEditMode}
          editDisabled={isEditDisabled}
          closeLabel="Close"
        />

        <CustomInput
          label="Default processor ID"
          value={formData.defaultProcessorId}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, defaultProcessorId: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />

        <CustomInput
          label="First processor ID"
          value={formData.firstProcessorEmail}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, firstProcessorId: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="First processor UUID"
          value={formData.firstProcessorUUID}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, firstProcessorUUID: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="First processor email"
          value={formData.firstProcessorEmail}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, firstProcessorEmail: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Second processor ID"
          value={formData.secondProcessorId}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, secondProcessorId: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Second processor UUID"
          value={formData.secondProcessorUUID}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, secondProcessorUUID: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Second processor email"
          value={formData.secondProcessorEmail}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, secondProcessorEmail: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Third processor ID"
          value={formData.thirdProcessorId}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, thirdProcessorId: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Third processor UUID"
          value={formData.thirdProcessorUUID}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, thirdProcessorUUID: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Third processor email"
          value={formData.thirdProcessorEmail}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, thirdProcessorEmail: value }))
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

export default ClientPaymentProcessorCard;
