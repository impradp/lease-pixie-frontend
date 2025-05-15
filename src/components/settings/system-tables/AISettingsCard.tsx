import React, { useCallback, useEffect, useState } from "react";
import { AISettingsV2 } from "@/types/AISettings";
import handleInfo from "@/lib/utils/errorHandler";
import { reasoningOptions } from "@/data/aiSettings";
import LinkButton from "@/components/ui/buttons/LinkButton";
import CustomInput from "@/components/ui/input/CustomInput";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { systemTableService } from "@/lib/services/systemTable";
import PixieTextArea from "@/components/ui/input/PixieTextArea";
import SectionHeader from "@/components/ui/header/SectionHeader";
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
  const [formData, setFormData] = useState<AISettingsV2 | undefined>(undefined);
  const [initialFormData, setInitialFormData] = useState<
    AISettingsV2 | undefined
  >(undefined);

  const fetchAISettings = useCallback(async () => {
    isSubmitting(true);
    try {
      const response = await systemTableService.fetchAISettings();
      if (response.status === "SUCCESS" && response.data) {
        setFormData(response.data);
        setInitialFormData(response.data);
      } else {
        handleInfo({ code: 101503 });
      }
    } catch (err) {
      handleInfo({ code: 101504, error: err });
    } finally {
      isSubmitting(false);
    }
  }, [isSubmitting]);

  useEffect(() => {
    fetchAISettings();
  }, [fetchAISettings]);

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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData) return;
      isSubmitting(true);
      try {
        const formDataToSubmit = {
          ...formData,
          temperature: Number(formData.temperature),
          topP: Number(formData.topP),
          leaseMaxTokens: Number(formData.leaseMaxTokens),
          vendorMaxToken: Number(formData.vendorMaxToken),
          tenantMaxToken: Number(formData.tenantMaxToken),
          bankingMaxToken: Number(formData.bankingMaxToken),
        };
        const response = await systemTableService.updateAISettings(
          formDataToSubmit
        );
        if (response.status === "SUCCESS") {
          setInitialFormData(formData);
          handleInfo({ code: 101500 });
          setIsEditMode(false);
          onSectionClose();
        } else {
          handleInfo({ code: 101501 });
        }
      } catch (err) {
        handleInfo({ code: 101502, error: err });
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
          label="Temperature"
          value={formData?.temperature?.toString() ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, temperature: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />

        <CustomInput
          label="Top-P"
          value={formData?.topP?.toString() ?? ""}
          onChange={(value) =>
            setFormData((prev) => (prev ? { ...prev, topP: value } : prev))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />
        <CustomInput
          label="Lease: Max token"
          value={formData?.leaseMaxTokens?.toString() ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, leaseMaxTokens: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />
        <CustomInput
          label="Lease: Values model"
          value={formData?.leaseValuesModel ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, leaseValuesModel: value } : prev
            )
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
            value={formData?.leaseValuesReasoning ?? ""}
            onChange={(value) =>
              setFormData((prev) =>
                prev ? { ...prev, leaseValuesReasoning: value } : prev
              )
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
          value={formData?.leaseValuesInstruction ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, leaseValuesInstruction: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Lease: Pages model"
          value={formData?.leasePagesModel ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, leasePagesModel: value } : prev
            )
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
            value={formData?.leasePagesReasoning ?? ""}
            onChange={(value) =>
              setFormData((prev) =>
                prev ? { ...prev, leasePagesReasoning: value } : prev
              )
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
          value={formData?.leasePagesInstruction ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, leasePagesInstruction: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Lease: Sentences model"
          value={formData?.leaseSentencesModel ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, leaseSentencesModel: value } : prev
            )
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
            value={formData?.leaseSentencesReasoning ?? ""}
            onChange={(value) =>
              setFormData((prev) =>
                prev ? { ...prev, leaseSentencesReasoning: value } : prev
              )
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
          value={formData?.leaseSentencesInstruction ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, leaseSentencesInstruction: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Lease: Summary model"
          value={formData?.leaseSummaryModel ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, leaseSummaryModel: value } : prev
            )
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
            value={formData?.leaseSummaryReasoning ?? ""}
            onChange={(value) =>
              setFormData((prev) =>
                prev ? { ...prev, leaseSummaryReasoning: value } : prev
              )
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
          value={formData?.leaseSummaryInstruction ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, leaseSummaryInstruction: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Workflow: Max token"
          value={formData?.workflowMaxToken?.toString() ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, workflowMaxToken: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />
        <CustomInput
          label="Workflow: Model"
          value={formData?.workflowModel ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, workflowModel: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <PixieTextArea
          label="Workflow: Instructions"
          value={formData?.workflowInstruction ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, workflowInstruction: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Workflow: Tenant vector storage ID"
          value={formData?.workflowTenantVectorStorageId ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, workflowTenantVectorStorageId: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Workflow: Inquiry vector storage ID"
          value={formData?.workflowInquiryVectorStorageId ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, workflowInquiryVectorStorageId: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Workflow: Maintainence vector storage ID"
          value={formData?.workflowMaintenanceVectorStorageId ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev
                ? { ...prev, workflowMaintenanceVectorStorageId: value }
                : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Workflow: Property vector storage ID"
          value={formData?.workflowPropertyVectorStorageId ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, workflowPropertyVectorStorageId: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Workflow: Lease vector storage ID"
          value={formData?.workflowLeaseVectorStorageId ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, workflowLeaseVectorStorageId: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Workflow: Accounting vector storage ID"
          value={formData?.workflowAccountingVectorStorageId ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev
                ? { ...prev, workflowAccountingVectorStorageId: value }
                : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Workflow: Bill-Pay vector storage ID"
          value={formData?.workflowBillPayVectorStorageId ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, workflowBillPayVectorStorageId: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Vendor: Max token"
          value={formData?.vendorMaxToken?.toString() ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, vendorMaxToken: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />
        <CustomInput
          label="Vendor: Model"
          value={formData?.vendorModel ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, vendorModel: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <PixieTextArea
          label="Vendor: Instructions"
          value={formData?.vendorInstruction ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, vendorInstruction: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Tenant: Max token"
          value={formData?.tenantMaxToken?.toString() ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, tenantMaxToken: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />
        <CustomInput
          label="Tenant: Model"
          value={formData?.tenantModel ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, tenantModel: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <PixieTextArea
          label="Tenant: Instructions"
          value={formData?.tenantInstruction ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, tenantInstruction: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <CustomInput
          label="Banking: Max token"
          value={formData?.bankingMaxToken?.toString() ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, bankingMaxToken: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
          type="number"
        />
        <CustomInput
          label="Banking: Model"
          value={formData?.bankingModel ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, bankingModel: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />

        <CustomInput
          label="Banking: Reasoning"
          value={formData?.bankingReasoning ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, bankingReasoning: value } : prev
            )
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        <PixieTextArea
          label="Banking: Instructions"
          value={formData?.bankingInstruction ?? ""}
          onChange={(value) =>
            setFormData((prev) =>
              prev ? { ...prev, bankingInstruction: value } : prev
            )
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
