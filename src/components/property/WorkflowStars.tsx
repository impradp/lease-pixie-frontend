import React, { useState, useEffect } from "react";

import handleInfo from "@/lib/utils/errorHandler";
import NewStarUser from "@/components/property/NewStarUser";
import { portfolioService } from "@/lib/services/portfolio";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { DropdownOption, NewUserFormData } from "@/types/user";
import LinkButton from "@/components/ui/buttons/LinkButton";
import { PixieDropdown } from "@/components/ui/input/PixieDropdown";
import { SectionHeader } from "@/components/ui/header/SectionHeader";
import { CustomDropdown } from "@/components/ui/input/CustomDropdown";
import { IconLinkButton } from "@/components/ui/buttons/IconLinkButton";
import { hasRole } from "@/lib/utils/authUtils";

/**
 * Form data structure for workflow stars
 */
interface WorkflowStarsFormData {
  maintainenceStar: DropdownOption | undefined; // Selected maintenance star
  accountingStar: DropdownOption | undefined; // Selected accounting star
  leaseStar: DropdownOption | undefined; // Selected lease star
  billPayStar: DropdownOption | undefined; // Selected bill pay star
  maintainenceStarThreshold: DropdownOption | undefined; // Maintenance star threshold
  accountingStarThreshold: DropdownOption | undefined; // Accounting star threshold
  leaseStarThreshold: DropdownOption | undefined; // Lease star threshold
  billPayStarThreshold: DropdownOption | undefined; // Bill pay star threshold
}

/**
 * Options for star dropdowns and thresholds
 */
interface StarOptions {
  maintainenceStars: DropdownOption[]; // Options for maintenance stars
  accountingStars: DropdownOption[]; // Options for accounting stars
  leaseStars: DropdownOption[]; // Options for lease stars
  billPayStars: DropdownOption[]; // Options for bill pay stars
  workflowInactivityThresholds: DropdownOption[]; // Options for inactivity thresholds
}

/**
 * Props for the WorkflowStars component
 */
interface WorkflowStarsProps {
  label?: string; // Label for the component
  initialFormData: WorkflowStarsFormData; // Initial star and threshold selections
  onFormDataChange: (formData: WorkflowStarsFormData) => void; // Callback for form data changes
  starOptions: StarOptions; // Available star and threshold options
  showInfo?: boolean; // Whether to show info tooltips
  infoContents?: string[]; // Content for info tooltips
  sectionId: string; // Unique identifier for the section
  editingSection: string | null; // Currently editing section ID
  onSectionEdit: (section: string) => void; // Callback for entering edit mode
  onSectionClose: () => void; // Callback for closing edit mode
  subLabels: string[]; // Labels for dropdowns
}

/**
 * Renders a component for managing workflow stars with dropdowns for roles and thresholds
 * @param props - The properties for configuring the component
 * @returns JSX.Element - The rendered workflow stars component
 */
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
    useState<WorkflowStarsFormData>(initialFormData); // Current form data
  const [originalFormData, setOriginalFormData] =
    useState<WorkflowStarsFormData>(initialFormData); // Original form data
  const [showNewStarModal, setShowNewStarModal] = useState(false); // Controls new user modal visibility
  const [isEditMode, setIsEditMode] = useState(false); // Tracks edit mode state
  const [portfolioUserAccess, setPortfolioUserAccess] = useState(false);

  const hasAccountUserAccess = hasRole("AccountUser");

  // Move the access check into useEffect to avoid infinite renders
  useEffect(() => {
    // TODO: Check with the API whether settings card is accessible for edit
    // For now, setting a default value that won't cause infinite renders
    setPortfolioUserAccess(false);
  }, []);

  /**
   * Syncs form data with initial props
   */
  useEffect(() => {
    // Updates state when initial form data changes
    setFormData(initialFormData);
    setOriginalFormData(initialFormData);
  }, [initialFormData]);

  /**
   * Manages body overflow based on modal visibility
   */
  useEffect(() => {
    // Locks/unlocks scroll when modal is open
    if (showNewStarModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showNewStarModal]);

  /**
   * Handles adding a new star user via API
   * @param userData - Data for the new user
   * @param setLoading - Function to toggle loading state
   */
  const handleAddStar = async (
    userData: NewUserFormData,
    setLoading: (loading: boolean) => void
  ) => {
    // Submits new user data
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await portfolioService.addUser(userData);
      if (response?.status === "SUCCESS") {
        setShowNewStarModal(false);
        handleInfo({ code: 100600 });
      } else {
        handleInfo({ code: 100601 });
      }
    } catch (err) {
      handleInfo({ code: 100602, error: err });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Closes the new star user modal
   */
  const handleCloseStarModal = () => {
    // Hides the new user modal
    setShowNewStarModal(false);
  };

  /**
   * Enters edit mode for the section
   */
  const handleEdit = () => {
    // Initiates edit mode if allowed
    if (editingSection === null || editingSection === sectionId) {
      setIsEditMode(true);
      onSectionEdit(sectionId);
    }
  };

  /**
   * Cancels edit mode and reverts changes
   */
  const handleTextClose = () => {
    // Exits edit mode and reverts form data
    setIsEditMode(false);
    setFormData(originalFormData);
    onSectionClose();
  };

  /**
   * Saves changes and exits edit mode
   */
  const handleUpdate = () => {
    // Applies form changes and exits edit mode
    setIsEditMode(false);
    onFormDataChange(formData);
    onSectionClose();
  };

  /**
   * Updates a specific field in the form data
   * @param field - The field to update
   * @param value - The new value
   */
  const handleFieldChange = (
    field: keyof WorkflowStarsFormData,
    value: DropdownOption | undefined
  ) => {
    // Updates a single star selection
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Updates a threshold field based on selected value
   * @param field - The threshold field to update
   * @param value - The selected value
   */
  const handleThresholdChange = (
    field: keyof WorkflowStarsFormData,
    value: string
  ) => {
    // Updates a threshold selection
    const selectedOption = starOptions.workflowInactivityThresholds.find(
      (opt) => opt.value === value
    );
    handleFieldChange(field, selectedOption);
  };

  const isEditDisabled =
    editingSection !== null && editingSection !== sectionId; // Determines if edit is disabled

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
          cardActionContent="Portfolio User %s Edit"
          hasAccess={portfolioUserAccess}
          showCardActionContent={hasAccountUserAccess}
        />

        <CustomDropdown
          options={starOptions.maintainenceStars}
          value={formData.maintainenceStar?.value}
          onChange={
            isEditMode
              ? (option) => handleFieldChange("maintainenceStar", option)
              : undefined
          }
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
            className={"xs:w-[162px]"}
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
            className={"xs:w-[162px]"}
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
            className={"xs:w-[162px]"}
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
            className={"xs:w-[162px]"}
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
              <div className="flex justify-center">
                <LinkButton onClick={handleTextClose} />
              </div>
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
