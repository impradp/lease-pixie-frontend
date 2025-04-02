import React, { useState, useEffect } from "react";

import toastr from "@/lib/func/toastr";
import NewStarUser from "@/components/property/NewStarUser";
import { portfolioService } from "@/lib/services/portfolio";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { DropdownOption, NewUserFormData } from "@/types/user";
import CancelButton from "@/components/ui/buttons/CancelButton";
import { PixieDropdown } from "@/components/ui/input/PixieDropdown";
import { SectionHeader } from "@/components/ui/header/SectionHeader";
import { CustomDropdown } from "@/components/ui/input/CustomDropdown";
import { IconLinkButton } from "@/components/ui/buttons/IconLinkButton";

interface WorkflowStarsFormData {
  maintainenceStar: DropdownOption | undefined;
  accountingStar: DropdownOption | undefined;
  leaseStar: DropdownOption | undefined;
  billPayStar: DropdownOption | undefined;
  maintainenceStarThreshold: DropdownOption | undefined;
  accountingStarThreshold: DropdownOption | undefined;
  leaseStarThreshold: DropdownOption | undefined;
  billPayStarThreshold: DropdownOption | undefined;
}

interface StarOptions {
  maintainenceStars: DropdownOption[];
  accountingStars: DropdownOption[];
  leaseStars: DropdownOption[];
  billPayStars: DropdownOption[];
  workflowInactivityThresholds: DropdownOption[];
}

interface WorkflowStarsProps {
  label?: string;
  initialFormData: WorkflowStarsFormData;
  onFormDataChange: (formData: WorkflowStarsFormData) => void;
  starOptions: StarOptions;
  showInfo?: boolean;
  infoContents?: string[];
  sectionId: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
  subLabels: string[];
}

const WorkflowStars: React.FC<WorkflowStarsProps> = ({
  label = "",
  initialFormData,
  onFormDataChange,
  starOptions,
  showInfo,
  infoContents = [],
  sectionId,
  editingSection,
  onSectionEdit,
  onSectionClose,
  subLabels = [
    "Selected Star 1",
    "Selected Star 2",
    "Selected Star 3",
    "Selected Star 4",
  ],
}) => {
  const [formData, setFormData] =
    useState<WorkflowStarsFormData>(initialFormData);
  const [originalFormData, setOriginalFormData] =
    useState<WorkflowStarsFormData>(initialFormData);
  const [showNewStarModal, setShowNewStarModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setFormData(initialFormData);
    setOriginalFormData(initialFormData);
  }, [initialFormData]);

  useEffect(() => {
    if (showNewStarModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showNewStarModal]);

  const handleAddStar = async (
    userData: NewUserFormData,
    setLoading: (loading: boolean) => void
  ) => {
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await portfolioService.addUser(userData);
      if (response?.status === "SUCCESS") {
        setShowNewStarModal(false);
        toastr({
          message: "New property user added successfully.",
          toastrType: "success",
        });
      } else {
        toastr({
          message: "Error adding new property user.",
          toastrType: "error",
        });
      }
    } catch {
      toastr({
        message: "Exception occurred adding new property user.",
        toastrType: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseStarModal = () => {
    setShowNewStarModal(false);
  };

  const handleEdit = () => {
    if (editingSection === null || editingSection === sectionId) {
      setIsEditMode(true);
      onSectionEdit(sectionId);
    }
  };

  const handleTextClose = () => {
    setIsEditMode(false);
    setFormData(originalFormData);
    onSectionClose();
  };

  const handleUpdate = () => {
    setIsEditMode(false);
    onFormDataChange(formData);
    onSectionClose();
  };

  const handleFieldChange = (
    field: keyof WorkflowStarsFormData,
    value: DropdownOption | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleThresholdChange = (
    field: keyof WorkflowStarsFormData,
    value: string
  ) => {
    const selectedOption = starOptions.workflowInactivityThresholds.find(
      (opt) => opt.value === value
    );
    handleFieldChange(field, selectedOption);
  };

  const isEditDisabled =
    editingSection !== null && editingSection !== sectionId;

  return (
    <>
      <div
        className={`rounded-xl p-6 flex flex-col gap-4 ${
          isEditMode ? "bg-card-open-fill" : "bg-card-close-fill"
        }`}
      >
        <SectionHeader
          title={label}
          onEdit={handleEdit}
          onTextCancel={handleTextClose}
          showEditButton={!isEditMode}
          showTextCloseButton={isEditMode}
          editDisabled={isEditDisabled}
        />

        <CustomDropdown
          options={starOptions.maintainenceStars}
          value={formData.maintainenceStar?.value}
          onChange={
            isEditMode
              ? (option) => handleFieldChange("maintainenceStar", option)
              : undefined
          }
          readOnly={!isEditMode}
          isEditing={isEditMode}
          label={subLabels[0]}
          showInfo={showInfo}
          infoContent={infoContents[0]}
        />
        <div className="flex justify-end items-center">
          <PixieDropdown
            label="Workflow inactivity threshold (hours)"
            options={starOptions.workflowInactivityThresholds}
            value={formData.maintainenceStarThreshold?.value}
            onChange={(value) =>
              handleThresholdChange("maintainenceStarThreshold", value)
            }
            isEditing={isEditMode}
            readOnly={!isEditMode}
            className="w-[165px]"
          />
        </div>

        {isEditMode && (
          <IconLinkButton
            label={`Add User`}
            onClick={() => setShowNewStarModal(true)}
          />
        )}

        <CustomDropdown
          options={starOptions.accountingStars}
          value={formData.accountingStar?.value}
          onChange={
            isEditMode
              ? (option) => handleFieldChange("accountingStar", option)
              : undefined
          }
          readOnly={!isEditMode}
          isEditing={isEditMode}
          label={subLabels[1]}
          showInfo={showInfo}
          infoContent={infoContents[1]}
        />
        <div className="flex justify-end items-center">
          <PixieDropdown
            label="Workflow inactivity threshold (hours)"
            options={starOptions.workflowInactivityThresholds}
            value={formData.accountingStarThreshold?.value}
            onChange={(value) =>
              handleThresholdChange("accountingStarThreshold", value)
            }
            isEditing={isEditMode}
            readOnly={!isEditMode}
            className="w-[165px]"
          />
        </div>
        {isEditMode && (
          <IconLinkButton
            label={`Add User`}
            onClick={() => setShowNewStarModal(true)}
          />
        )}

        <CustomDropdown
          options={starOptions.leaseStars}
          value={formData.leaseStar?.value}
          onChange={
            isEditMode
              ? (option) => handleFieldChange("leaseStar", option)
              : undefined
          }
          readOnly={!isEditMode}
          isEditing={isEditMode}
          label={subLabels[2]}
          showInfo={showInfo}
          infoContent={infoContents[2]}
        />
        <div className="flex justify-end items-center">
          <PixieDropdown
            label="Workflow inactivity threshold (hours)"
            options={starOptions.workflowInactivityThresholds}
            value={formData.leaseStarThreshold?.value}
            onChange={(value) =>
              handleThresholdChange("leaseStarThreshold", value)
            }
            isEditing={isEditMode}
            readOnly={!isEditMode}
            className="w-[165px]"
          />
        </div>
        {isEditMode && (
          <IconLinkButton
            label={`Add User`}
            onClick={() => setShowNewStarModal(true)}
          />
        )}

        <CustomDropdown
          options={starOptions.billPayStars}
          value={formData.billPayStar?.value}
          onChange={
            isEditMode
              ? (option) => handleFieldChange("billPayStar", option)
              : undefined
          }
          readOnly={!isEditMode}
          isEditing={isEditMode}
          label={subLabels[3]}
          showInfo={showInfo}
          infoContent={infoContents[3]}
        />
        <div className="flex justify-end items-center">
          <PixieDropdown
            label="Workflow inactivity threshold (hours)"
            options={starOptions.workflowInactivityThresholds}
            value={formData.billPayStarThreshold?.value}
            onChange={(value) =>
              handleThresholdChange("billPayStarThreshold", value)
            }
            isEditing={isEditMode}
            readOnly={!isEditMode}
            className="w-[165px]"
          />
        </div>

        {isEditMode && (
          <>
            <IconLinkButton
              label={`Add User`}
              onClick={() => setShowNewStarModal(true)}
            />
            <div className="flex flex-col gap-3">
              <PixieButton
                label="Update"
                disabled={false}
                onClick={handleUpdate}
                className="w-full"
              />
              <CancelButton onClick={handleTextClose} />
            </div>
          </>
        )}
      </div>

      {showNewStarModal && (
        <div className="fixed inset-0 z-50">
          <div className="relative z-50">
            <NewStarUser
              onClose={handleCloseStarModal}
              onSubmit={handleAddStar}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default WorkflowStars;
