import React, { useEffect, useState } from "react";
import { AISettings } from "@/types/AISettings";
import { reasoningOptions, sampleAISettings } from "@/data/aiSettings";
import LinkButton from "@/components/ui/buttons/LinkButton";
import CustomInput from "@/components/ui/input/CustomInput";
import PixieButton from "@/components/ui/buttons/PixieButton";
import SectionHeader from "@/components/ui/header/SectionHeader";
import PixieTextArea from "@/components/ui/input/PixieTextArea";
import { PixieDropdown } from "@/components/ui/input/PixieDropdown";

interface AISettingsCardProps {
  sectionName: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
  isSubmitting: (value: boolean) => void;
  isEditable: boolean;
}

const AISettingsCard: React.FC<AISettingsCardProps> = ({
  sectionName,
  editingSection,
  onSectionEdit,
  onSectionClose,
  isSubmitting,
  isEditable,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<AISettings>(sampleAISettings);
  const [initialFormData, setInitialFormData] =
    useState<AISettings>(sampleAISettings);

  useEffect(() => {
    setInitialFormData(sampleAISettings);
    setFormData(sampleAISettings);
  }, [sampleAISettings]);

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
          title={"AI Settings"}
          editLabel={"View"}
          onEdit={handleEdit}
          onTextCancel={handleTextClose}
          showEditButton={!isEditMode}
          showTextCloseButton={isEditMode}
          editDisabled={isEditDisabled}
          closeLabel="Close"
        />

        <CustomInput
          label="Tempreature"
          value={formData.tempreature}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, tempreature: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />

        <CustomInput
          label="Top-P"
          value={formData.topP}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, topP: value }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Lease: Max token"
          value={formData.lease.maxToken}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              lease: { ...prev.lease, maxToken: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Lease: Values model"
          value={formData.lease.values.model}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              lease: {
                ...prev.lease,
                values: {
                  ...prev.lease.values,
                  model: value,
                },
              },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <div className="self-stretch flex flex-col justify-center items-start gap-1">
          <div
            className={`justify-start text-secondary-light text-sm font-medium font-['Inter'] leading-[18px]`}
          >
            Lease: Values reasoning
          </div>
          <PixieDropdown
            options={reasoningOptions}
            value={formData.lease.values.reasoning}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                lease: {
                  ...prev.lease,
                  values: {
                    ...prev.lease.values,
                    reasoning: value,
                  },
                },
              }))
            }
            isEditing={isEditMode}
            placeholder="Select reasoning"
            className="w-full"
            containerClassName="w-full"
            type="large"
            labelClassName="hidden"
          />
        </div>
        <PixieTextArea
          label="Lease: Values instructions"
          value={formData.lease.values.instructions}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              lease: {
                ...prev.lease,
                values: {
                  ...prev.lease.values,
                  instructions: value,
                },
              },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Lease: Pages model"
          value={formData.lease.pages.model}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              lease: {
                ...prev.lease,
                pages: {
                  ...prev.lease.pages,
                  model: value,
                },
              },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <div className="self-stretch flex flex-col justify-center items-start gap-1">
          <div
            className={`justify-start text-secondary-light text-sm font-medium font-['Inter'] leading-[18px]`}
          >
            Lease: Pages reasoning
          </div>
          <PixieDropdown
            options={reasoningOptions}
            value={formData.lease.pages.reasoning}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                lease: {
                  ...prev.lease,
                  pages: {
                    ...prev.lease.pages,
                    reasoning: value,
                  },
                },
              }))
            }
            isEditing={isEditMode}
            placeholder="Select reasoning"
            className="w-full"
            containerClassName="w-full"
            type="large"
            labelClassName="hidden"
          />
        </div>
        <PixieTextArea
          label="Lease: Pages instructions"
          value={formData.lease.pages.instructions}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              lease: {
                ...prev.lease,
                pages: {
                  ...prev.lease.pages,
                  instructions: value,
                },
              },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Lease: Sentences model"
          value={formData.lease.sentences.model}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              lease: {
                ...prev.lease,
                sentences: {
                  ...prev.lease.sentences,
                  model: value,
                },
              },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <div className="self-stretch flex flex-col justify-center items-start gap-1">
          <div
            className={`justify-start text-secondary-light text-sm font-medium font-['Inter'] leading-[18px]`}
          >
            Lease: Sentences reasoning
          </div>
          <PixieDropdown
            options={reasoningOptions}
            value={formData.lease.sentences.reasoning}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                lease: {
                  ...prev.lease,
                  sentences: {
                    ...prev.lease.sentences,
                    reasoning: value,
                  },
                },
              }))
            }
            isEditing={isEditMode}
            placeholder="Select reasoning"
            className="w-full"
            containerClassName="w-full"
            type="large"
            labelClassName="hidden"
          />
        </div>
        <PixieTextArea
          label="Lease: Sentences instructions"
          value={formData.lease.sentences.instructions}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              lease: {
                ...prev.lease,
                sentences: {
                  ...prev.lease.sentences,
                  instructions: value,
                },
              },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Lease: Summary model"
          value={formData.lease.summary.model}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              lease: {
                ...prev.lease,
                summary: {
                  ...prev.lease.summary,
                  model: value,
                },
              },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <div className="self-stretch flex flex-col justify-center items-start gap-1">
          <div
            className={`justify-start text-secondary-light text-sm font-medium font-['Inter'] leading-[18px]`}
          >
            Lease: Summary reasoning
          </div>
          <PixieDropdown
            options={reasoningOptions}
            value={formData.lease.summary.reasoning}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                lease: {
                  ...prev.lease,
                  summary: {
                    ...prev.lease.summary,
                    reasoning: value,
                  },
                },
              }))
            }
            isEditing={isEditMode}
            placeholder="Select reasoning"
            className="w-full"
            containerClassName="w-full"
            type="large"
            labelClassName="hidden"
          />
        </div>
        <PixieTextArea
          label="Lease: Summary instructions"
          value={formData.lease.summary.instructions}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              lease: {
                ...prev.lease,
                summary: {
                  ...prev.lease.summary,
                  instructions: value,
                },
              },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Workflow: Max token"
          value={formData.workflow.maxToken}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              workflow: { ...prev.workflow, maxToken: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Workflow: Model"
          value={formData.workflow.model}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              workflow: { ...prev.workflow, model: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <PixieTextArea
          label="Workflow: Instructions"
          value={formData.workflow.instructions}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              workflow: { ...prev.workflow, instructions: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Workflow: Tenant vector storage ID"
          value={formData.workflow.tenantVectorStorageId}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              workflow: { ...prev.workflow, tenantVectorStorageId: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Workflow: Inquiry vector storage ID"
          value={formData.workflow.inquiryVectorStorageId}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              workflow: { ...prev.workflow, inquiryVectorStorageId: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Workflow: Maintainence vector storage ID"
          value={formData.workflow.maintainenceVectorStorageId}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              workflow: {
                ...prev.workflow,
                maintainenceVectorStorageId: value,
              },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Workflow: Property vector storage ID"
          value={formData.workflow.propertyVectorStorageId}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              workflow: { ...prev.workflow, propertyVectorStorageId: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Workflow: Lease vector storage ID"
          value={formData.workflow.leaseVectorStorageId}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              workflow: { ...prev.workflow, leaseVectorStorageId: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Workflow: Accounting vector storage ID"
          value={formData.workflow.accountingVectorStorageId}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              workflow: { ...prev.workflow, accountingVectorStorageId: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Workflow: Bill-Pay vector storage ID"
          value={formData.workflow.billPayVectorStorageId}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              workflow: { ...prev.workflow, billPayVectorStorageId: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Vendor: Max token"
          value={formData.vendor.maxToken}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              vendor: { ...prev.vendor, maxToken: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Vendor: Model"
          value={formData.vendor.model}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              vendor: { ...prev.vendor, model: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <PixieTextArea
          label="Vendor: Instructions"
          value={formData.vendor.instructions}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              vendor: { ...prev.vendor, instructions: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Tenant: Max token"
          value={formData.tenant.maxToken}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              tenant: { ...prev.tenant, maxToken: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Tenant: Model"
          value={formData.tenant.model}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              tenant: { ...prev.tenant, model: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <PixieTextArea
          label="Tenant: Instructions"
          value={formData.tenant.instructions}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              tenant: { ...prev.tenant, instructions: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Banking: Max token"
          value={formData.banking.maxToken}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              banking: { ...prev.banking, maxToken: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Banking: Model"
          value={formData.banking.model}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              banking: { ...prev.banking, model: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />

        <CustomInput
          label="Banking: Reasoning"
          value={formData.banking.reasoning}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              banking: { ...prev.banking, reasoning: value },
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <PixieTextArea
          label="Banking: Instructions"
          value={formData.banking.instructions}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              banking: { ...prev.banking, instructions: value },
            }))
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

export default AISettingsCard;
