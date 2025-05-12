import React, { useEffect, useState } from "react";

import { hasRole } from "@/lib/utils/authUtils";
import { CreateSettings } from "@/types/CreateSettings";
import CustomInput from "@/components/ui/input/CustomInput";
import LinkButton from "@/components/ui/buttons/LinkButton";
import PixieButton from "@/components/ui/buttons/PixieButton";
import SectionHeader from "@/components/ui/header/SectionHeader";
import { PixieDropdown } from "@/components/ui/input/PixieDropdown";
import {
  createSettingsInfo,
  portfolioOptions,
} from "@/data/createSettingsData";

interface CreateSettingsCardProps {
  sectionName: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
  isSubmitting: (value: boolean) => void;
  isEditable: boolean;
}

const CreateSettingsCard: React.FC<CreateSettingsCardProps> = ({
  sectionName,
  editingSection,
  onSectionEdit,
  onSectionClose,
  isSubmitting,
  isEditable,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<CreateSettings>(createSettingsInfo);
  const [initialFormData, setInitialFormData] =
    useState<CreateSettings>(createSettingsInfo);

  const [portfolioUserAccess, setPortfolioUserAccess] = useState(false);

  const hasAccountUserAccess = hasRole("AccountUser");

  // Move the access check into useEffect to avoid infinite renders
  useEffect(() => {
    // TODO: Check with the API whether settings card is accessible for edit
    // For now, setting a default value that won't cause infinite renders
    setPortfolioUserAccess(false);
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    setInitialFormData(createSettingsInfo);
    setFormData(createSettingsInfo);
  }, [createSettingsInfo]);

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
          title={"Create Settings"}
          onEdit={handleEdit}
          onTextCancel={handleTextClose}
          showEditButton={!isEditMode}
          showTextCloseButton={isEditMode}
          editDisabled={isEditDisabled}
          cardActionContent="Portfolio User %s Edit"
          hasAccess={portfolioUserAccess}
          showCardActionContent={hasAccountUserAccess}
          onAccessToggle={(val) => setPortfolioUserAccess(val)}
        />

        <PixieDropdown
          label="Portfolio"
          options={portfolioOptions}
          value={formData.portfolioName}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, portfolioName: value }))
          }
          isEditing={isEditMode}
          type="large"
        />
        <CustomInput
          label="Folder Name (no special characters, limit 25 characters)"
          value={formData.folderName ?? ""}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, folderName: value }))
          }
          isEditing={isEditMode}
          isRequired={true}
          maxCharLength={25}
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

export default CreateSettingsCard;
