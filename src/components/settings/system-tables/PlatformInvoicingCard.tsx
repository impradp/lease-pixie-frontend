import React, { useEffect, useState, useCallback } from "react";

import handleInfo from "@/lib/utils/errorHandler";
import CustomInput from "@/components/ui/input/CustomInput";
import LinkButton from "@/components/ui/buttons/LinkButton";
import { PlatformInvoicing } from "@/types/PlatformInvoicing";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { systemTableService } from "@/lib/services/systemTable";
import SectionHeader from "@/components/ui/header/SectionHeader";

interface PlatformInvoicingCardProps {
  sectionName: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
  isSubmitting: (value: boolean) => void;
  isEditable: boolean;
}

/**
 * A React component that renders a card for managing platform invoicing information.
 * Supports viewing and editing modes with form inputs for invoicing details.
 *
 * @param props - The properties for the component.
 * @param props.sectionName - The name of the section this card represents.
 * @param props.editingSection - The currently active editing section, or null if none.
 * @param props.onSectionEdit - Callback to handle edit mode activation for a section.
 * @param props.onSectionClose - Callback to handle closing the edit mode.
 * @param props.isSubmitting - Callback to indicate form submission status.
 * @param props.isEditable - Flag to determine if the form fields are editable.
 */
const PlatformInvoicingCard: React.FC<PlatformInvoicingCardProps> = ({
  sectionName,
  editingSection,
  onSectionEdit,
  onSectionClose,
  isSubmitting,
  isEditable,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<PlatformInvoicing | undefined>(
    undefined
  );
  const [initialFormData, setInitialFormData] = useState<
    PlatformInvoicing | undefined
  >(undefined);

  /**
   * Fetches platform invoicing data on component mount.
   */
  const fetchPlatformInvoicing = useCallback(async () => {
    isSubmitting(true);
    try {
      const response = await systemTableService.fetchPlatformInvoicing();
      if (response.status === "SUCCESS" && response.data) {
        setFormData(response.data);
        setInitialFormData(response.data);
      } else {
        handleInfo({ code: 101403 });
      }
    } catch (err) {
      handleInfo({ code: 101404, error: err });
    } finally {
      isSubmitting(false);
    }
  }, [isSubmitting]);

  useEffect(() => {
    fetchPlatformInvoicing();
  }, [fetchPlatformInvoicing]);

  /**
   * Handles the edit button click to enable edit mode.
   */
  const handleEdit = useCallback(() => {
    if (editingSection === null || editingSection === sectionName) {
      onSectionEdit(sectionName);
      setIsEditMode(true);
    }
  }, [editingSection, onSectionEdit, sectionName]);

  /**
   * Handles the cancel button click to revert form data and exit edit mode.
   */
  const handleTextClose = useCallback(() => {
    setFormData(initialFormData);
    setIsEditMode(false);
    onSectionClose();
  }, [initialFormData, onSectionClose]);

  /**
   * Handles form submission to update platform invoicing data via API.
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData) return;
      isSubmitting(true);
      try {
        const response = await systemTableService.updatePlatformInvoicing(
          formData
        );
        if (response.status === "SUCCESS") {
          setInitialFormData(formData);
          handleInfo({ code: 101400 });
          setIsEditMode(false);
          onSectionClose();
        } else {
          handleInfo({ code: 101401 });
        }
      } catch (err) {
        handleInfo({ code: 101402, error: err });
      } finally {
        isSubmitting(false);
      }
    },
    [formData, isSubmitting, onSectionClose]
  );

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
          title="Platform Invoicing"
          editLabel="Edit"
          onEdit={handleEdit}
          onTextCancel={handleTextClose}
          showEditButton={!isEditMode}
          showTextCloseButton={isEditMode}
          editDisabled={isEditDisabled}
          closeLabel="Close"
        />
        <CustomInput
          label="Billing ID"
          value={formData?.billerId ?? ""}
          onChange={(value) =>
            setFormData((prev) => (prev ? { ...prev, billerId: value } : prev))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Entity"
          value={formData?.entity ?? ""}
          onChange={(value) =>
            setFormData((prev) => (prev ? { ...prev, entity: value } : prev))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Street"
          value={formData?.street ?? ""}
          onChange={(value) =>
            setFormData((prev) => (prev ? { ...prev, street: value } : prev))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="City"
          value={formData?.city ?? ""}
          onChange={(value) =>
            setFormData((prev) => (prev ? { ...prev, city: value } : prev))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="State"
          value={formData?.state ?? ""}
          onChange={(value) =>
            setFormData((prev) => (prev ? { ...prev, state: value } : prev))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Zip code"
          value={formData?.zipCode ?? ""}
          onChange={(value) =>
            setFormData((prev) => (prev ? { ...prev, zipCode: value } : prev))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Office phone"
          value={formData?.officePhone ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, officePhone: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="mobile"
        />
        <CustomInput
          label="E-mail address"
          value={formData?.email ?? ""}
          onChange={(value) =>
            setFormData((prev) => (prev ? { ...prev, email: value } : prev))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="email"
        />
        <CustomInput
          label="Retail Base"
          value={formData?.retailBase ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, retailBase: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />
        <CustomInput
          label="Industrial Base"
          value={formData?.industrialBase ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, industrialBase: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />
        {isEditMode && (
          <div className="flex flex-col gap-3">
            <PixieButton
              label="Update"
              type="submit"
              formId={`form-${sectionName}`}
              disabled={!isEditable}
              className="w-full"
            />
            <div className="flex justify-center">
              <LinkButton
                onClick={handleTextClose}
                label="Cancel"
                disabled={!isEditable}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PlatformInvoicingCard;
