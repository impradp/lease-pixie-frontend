import React, { useEffect, useState } from "react";
import CustomInput from "@/components/ui/input/CustomInput";
import PixieButton from "@/components/ui/buttons/PixieButton";
import LinkButton from "@/components/ui/buttons/LinkButton";
import SectionHeader from "@/components/ui/header/SectionHeader";
import { ClientPaymentProcessor } from "@/types/ClientPaymentProcessor";
import {
  processorOptions,
  sampleClientPaymentProcessor,
} from "@/data/clientPaymentProcessors";
import { PixieDropdown } from "@/components/ui/input/PixieDropdown";

interface ClientPaymentProcessorCardProps {
  sectionName: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
  isSubmitting: (value: boolean) => void;
  isEditable: boolean;
}

/**
 * A React component that renders a card for managing client payment processor information.
 * Supports viewing and editing modes with form inputs for processor details.
 *
 * @param props - The properties for the component.
 * @param props.sectionName - The name of the section this card represents.
 * @param props.editingSection - The currently active editing section, or null if none.
 * @param props.onSectionEdit - Callback to handle edit mode activation for a section.
 * @param props.onSectionClose - Callback to handle closing the edit mode.
 * @param props.isSubmitting - Callback to indicate form submission status.
 * @param props.isEditable - Flag to determine if the form fields are editable.
 */
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

  /**
   * Syncs form data with the sample client payment processor data on mount or update.
   */
  useEffect(() => {
    setInitialFormData(sampleClientPaymentProcessor);
    setFormData(sampleClientPaymentProcessor);
  }, [sampleClientPaymentProcessor]);

  /**
   * Handles the edit button click to enable edit mode.
   * Only activates if no other section is being edited or if this section is the target.
   */
  const handleEdit = () => {
    if (editingSection === null || editingSection === sectionName) {
      onSectionEdit(sectionName);
      setIsEditMode(true);
    }
  };

  /**
   * Handles the cancel button click to revert form data and exit edit mode.
   */
  const handleTextClose = () => {
    setFormData(initialFormData); // Revert to initial values
    setIsEditMode(false);
    onSectionClose();
  };

  /**
   * Handles form submission, triggers submission status, and exits edit mode.
   *
   * @param e - The form submission event.
   */
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
        <div className="self-stretch flex flex-col justify-center items-start gap-1">
          <div
            className={`justify-start text-secondary-light text-sm font-medium font-['Inter'] leading-[18px]`}
          >
            Default processor ID
          </div>
          <PixieDropdown
            options={processorOptions}
            value={formData.defaultProcessorId}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, defaultProcessorId: value }))
            }
            isEditing={isEditMode}
            placeholder="Select processor"
            className="w-full"
            containerClassName="w-full"
            type="large"
            labelClassName="hidden"
          />
        </div>

        <CustomInput
          label="First processor ID"
          value={formData.firstProcessorId}
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
          type="number"
        />
        <CustomInput
          label="First processor email"
          value={formData.firstProcessorEmail}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, firstProcessorEmail: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="email"
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
          type="number"
        />
        <CustomInput
          label="Second processor email"
          value={formData.secondProcessorEmail}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, secondProcessorEmail: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="email"
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
          type="number"
        />
        <CustomInput
          label="Third processor email"
          value={formData.thirdProcessorEmail}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, thirdProcessorEmail: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="email"
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
