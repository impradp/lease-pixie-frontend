import React, { useEffect, useState, useCallback } from "react";

import { DropdownOption } from "@/types/user";
import handleInfo from "@/lib/utils/errorHandler";
import LinkButton from "@/components/ui/buttons/LinkButton";
import CustomInput from "@/components/ui/input/CustomInput";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { systemTableService } from "@/lib/services/systemTable";
import SectionHeader from "@/components/ui/header/SectionHeader";
import { PixieDropdown } from "@/components/ui/input/PixieDropdown";
import { ClientPaymentProcessor } from "@/types/ClientPaymentProcessor";

/**
 * Props for the ClientPaymentProcessorCard component.
 */
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
  const [formData, setFormData] = useState<ClientPaymentProcessor | undefined>(
    undefined
  );
  const [initialFormData, setInitialFormData] = useState<
    ClientPaymentProcessor | undefined
  >(undefined);
  const [processorOptions, setProcessorOptions] = useState<DropdownOption[]>(
    []
  );
  const [localLoading, setLocalLoading] = useState(true);

  /**
   * Fetches client payment processor data on component mount and sets processor options.
   */
  const fetchClientPaymentProcessor = useCallback(async () => {
    setLocalLoading(true);
    isSubmitting(true);
    try {
      const response = await systemTableService.fetchPaymentProcessor();
      if (response.status === "SUCCESS" && response.data) {
        setFormData(response.data);
        setInitialFormData(response.data);
        // Generate processor options from first, second, and third processors
        const options: DropdownOption[] = [];
        if (response.data.firstProcessor?.id) {
          options.push({
            label: "Processor 1",
            value: response.data.firstProcessor.id,
          });
        }
        if (response.data.secondProcessor?.id) {
          options.push({
            label: "Processor 2",
            value: response.data.secondProcessor.id,
          });
        }
        if (response.data.thirdProcessor?.id) {
          options.push({
            label: "Processor 3",
            value: response.data.thirdProcessor.id,
          });
        }
        setProcessorOptions(options);
      } else {
        handleInfo({ code: 101301 });
        setProcessorOptions([]);
      }
    } catch (err) {
      handleInfo({ code: 101301, error: err });
      setProcessorOptions([]);
    } finally {
      setLocalLoading(false);
      isSubmitting(false);
    }
  }, [isSubmitting]);

  useEffect(() => {
    fetchClientPaymentProcessor();
  }, [fetchClientPaymentProcessor]);

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
   * Handles form submission to update payment processor data via API.
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData) return;
      setLocalLoading(true);
      isSubmitting(true);
      try {
        const response = await systemTableService.updatePaymentProcessor(
          formData
        );
        if (response.status === "SUCCESS") {
          setInitialFormData(formData);
          handleInfo({ code: 101300 });
          setIsEditMode(false);
          onSectionClose();
          // Refresh processor options after update
          await fetchClientPaymentProcessor();
        } else {
          handleInfo({ code: 101303 });
        }
      } catch (err) {
        handleInfo({ code: 101304, error: err });
      } finally {
        setLocalLoading(false);
        isSubmitting(false);
      }
    },
    [formData, isSubmitting, onSectionClose, fetchClientPaymentProcessor]
  );

  const isEditDisabled =
    editingSection !== null && editingSection !== sectionName;

  // Render nothing until data is loaded
  if (localLoading || !formData) {
    return null;
  }

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
          title="Payment Processors"
          editLabel="Edit"
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
            Active on-boarding tenant processor ID
          </div>
          <PixieDropdown
            options={processorOptions}
            value={formData.defaultProcessorId || ""}
            onChange={(value) =>
              setFormData((prev) =>
                prev ? { ...prev, defaultProcessorId: value } : prev
              )
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
          label="First tenant processor ID"
          value={formData.firstProcessor?.id || ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev
                ? {
                    ...prev,
                    firstProcessor: { ...prev.firstProcessor, id: value },
                  }
                : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable || localLoading}
        />
        <CustomInput
          label="First tenant processor UUID"
          value={formData.firstProcessor?.uuid || ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev
                ? {
                    ...prev,
                    firstProcessor: { ...prev.firstProcessor, uuid: value },
                  }
                : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable || localLoading}
          type="text"
        />
        <CustomInput
          label="First tenant processor email"
          value={formData.firstProcessor?.email || ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev
                ? {
                    ...prev,
                    firstProcessor: { ...prev.firstProcessor, email: value },
                  }
                : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable || localLoading}
          type="email"
        />
        <CustomInput
          label="Second tenant processor ID"
          value={formData.secondProcessor?.id || ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev
                ? {
                    ...prev,
                    secondProcessor: { ...prev.secondProcessor, id: value },
                  }
                : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable || localLoading}
        />
        <CustomInput
          label="Second tenant processor UUID"
          value={formData.secondProcessor?.uuid || ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev
                ? {
                    ...prev,
                    secondProcessor: { ...prev.secondProcessor, uuid: value },
                  }
                : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable || localLoading}
          type="text"
        />
        <CustomInput
          label="Second tenant processor email"
          value={formData.secondProcessor?.email || ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev
                ? {
                    ...prev,
                    secondProcessor: { ...prev.secondProcessor, email: value },
                  }
                : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable || localLoading}
          type="email"
        />
        <CustomInput
          label="Third tenant processor ID"
          value={formData.thirdProcessor?.id || ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev
                ? {
                    ...prev,
                    thirdProcessor: { ...prev.thirdProcessor, id: value },
                  }
                : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable || localLoading}
        />
        <CustomInput
          label="Third tenant processor UUID"
          value={formData.thirdProcessor?.uuid || ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev
                ? {
                    ...prev,
                    thirdProcessor: { ...prev.thirdProcessor, uuid: value },
                  }
                : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable || localLoading}
          type="text"
        />
        <CustomInput
          label="Third tenant processor email"
          value={formData.thirdProcessor?.email || ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev
                ? {
                    ...prev,
                    thirdProcessor: { ...prev.thirdProcessor, email: value },
                  }
                : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable || localLoading}
          type="email"
        />
        <CustomInput
          label="Platform tenant processor ID"
          value={formData.platformProcessor?.id || ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev
                ? {
                    ...prev,
                    platformProcessor: { ...prev.platformProcessor, id: value },
                  }
                : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable || localLoading}
        />
        <CustomInput
          label="Platform tenant processor UUID"
          value={formData.platformProcessor?.uuid || ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev
                ? {
                    ...prev,
                    platformProcessor: {
                      ...prev.platformProcessor,
                      uuid: value,
                    },
                  }
                : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable || localLoading}
          type="text"
        />
        <CustomInput
          label="Platform tenant processor email"
          value={formData.platformProcessor?.email || ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev
                ? {
                    ...prev,
                    platformProcessor: {
                      ...prev.platformProcessor,
                      email: value,
                    },
                  }
                : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable || localLoading}
          type="email"
        />

        {isEditMode && (
          <div className="flex flex-col gap-3">
            <PixieButton
              label="Update"
              type="submit"
              formId={`form-${sectionName}`}
              disabled={!isEditable || localLoading}
              isLoading={localLoading}
              className="w-full"
            />
            <div className="flex justify-center">
              <LinkButton
                onClick={handleTextClose}
                label="Cancel"
                disabled={localLoading}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ClientPaymentProcessorCard;
