import React, { useEffect, useState } from "react";

import { AICosts } from "@/types/AISettings";
import { sampleAICosts } from "@/data/aiSettings";
import LinkButton from "@/components/ui/buttons/LinkButton";
import CustomInput from "@/components/ui/input/CustomInput";
import PixieButton from "@/components/ui/buttons/PixieButton";
import SectionHeader from "@/components/ui/header/SectionHeader";

/**
 * Props interface for the CostsCard component.
 *
 * @interface CostsCardProps
 * @property {string} sectionName - The name of the section this card represents.
 * @property {string | null} editingSection - The currently active editing section, or null if none.
 * @property {(section: string) => void} onSectionEdit - Callback to handle edit mode activation for a section.
 * @property {() => void} onSectionClose - Callback to handle closing the edit mode.
 * @property {(value: boolean) => void} isSubmitting - Callback to indicate form submission status.
 * @property {boolean} isEditable - Flag to determine if the form fields are editable.
 */
interface CostsCardProps {
  sectionName: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
  isSubmitting: (value: boolean) => void;
  isEditable: boolean;
}

/**
 * A React component that renders a card for managing AI cost settings.
 * Supports viewing and editing modes with form inputs for cost details.
 *
 * @param props - The properties for the component.
 * @param props.sectionName - The name of the section this card represents.
 * @param props.editingSection - The currently active editing section, or null if none.
 * @param props.onSectionEdit - Callback to handle edit mode activation for a section.
 * @param props.onSectionClose - Callback to handle closing the edit mode.
 * @param props.isSubmitting - Callback to indicate form submission status.
 * @param props.isEditable - Flag to determine if the form fields are editable.
 */
const CostsCard: React.FC<CostsCardProps> = ({
  sectionName,
  editingSection,
  onSectionEdit,
  onSectionClose,
  isSubmitting,
  isEditable,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<AICosts>(sampleAICosts);
  const [initialFormData, setInitialFormData] =
    useState<AICosts>(sampleAICosts);

  /**
   * Syncs form data with the sample AI costs data on mount or update.
   */
  useEffect(() => {
    setInitialFormData(sampleAICosts);
    setFormData(sampleAICosts);
  }, [sampleAICosts]);

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
          title={"Costs"}
          editLabel={"View"}
          onEdit={handleEdit}
          onTextCancel={handleTextClose}
          showEditButton={!isEditMode}
          showTextCloseButton={isEditMode}
          editDisabled={isEditDisabled}
          closeLabel="Close"
        />

        <CustomInput
          label="ACH"
          value={formData.ach}
          onChange={(value) => setFormData((prev) => ({ ...prev, ach: value }))}
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />

        <CustomInput
          label="o1: Input"
          value={formData.gptO1.input}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              gptO1: { ...prev.gptO1, input: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />
        <CustomInput
          label="o1: Output"
          value={formData.gptO1.output}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              gptO1: { ...prev.gptO1, output: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />
        <CustomInput
          label="o3-mini: Input"
          value={formData.gptO3Mini.input}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              gptO3Mini: {
                ...prev.gptO3Mini,
                input: value,
              },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />
        <CustomInput
          label="o3-mini: Output"
          value={formData.gptO3Mini.output}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              gptO3Mini: {
                ...prev.gptO3Mini,
                output: value,
              },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />
        <CustomInput
          label="4o-mini: Input"
          value={formData.gpt4OMini.input}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              gpt4OMini: {
                ...prev.gpt4OMini,
                input: value,
              },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />
        <CustomInput
          label="4o-mini: Output"
          value={formData.gpt4OMini.output}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              gpt4OMini: {
                ...prev.gpt4OMini,
                output: value,
              },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />
        <CustomInput
          label="1099"
          value={formData.form1099}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              form1099: value,
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />
        <CustomInput
          label="W-9"
          value={formData.w9}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              w9: value,
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />
        <CustomInput
          label="Custom Form"
          value={formData.customForm}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              customForm: value,
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />
        <CustomInput
          label="Plaid: Auth"
          value={formData.plaid.auth}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              plaid: { ...prev.plaid, auth: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />
        <CustomInput
          label="Plaid: Balance"
          value={formData.plaid.balance}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              plaid: { ...prev.plaid, balance: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />
        <CustomInput
          label="Plaid: Transactions (monthly)"
          value={formData.plaid.monthlyTransactions}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              plaid: { ...prev.plaid, monthlyTransactions: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
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

export default CostsCard;
