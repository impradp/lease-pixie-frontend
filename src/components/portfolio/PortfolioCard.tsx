import React, { useState } from "react";

import { Locale } from "@/locales";
import { getMessages } from "@/locales/loader";
import { CustomInput } from "@/components/ui/CustomInput";
import PixieButton from "@/components/buttons/PixieButton";
import CancelButton from "@/components/buttons/CancelButton";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface PortfolioCardProps {
  portfolioName: string;
  onEdit?: () => void;
  onNameChange?: (name: string) => void;
  sectionId: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  portfolioName,
  onEdit,
  onNameChange,
  sectionId,
  editingSection,
  onSectionEdit,
  onSectionClose,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalName, setOriginalName] = useState(portfolioName); // Store original value
  const [editedName, setEditedName] = useState(portfolioName); // Track edited value
  const isEditing = isEditMode;

  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);

  const handleEdit = () => {
    if (editingSection === null || editingSection === sectionId) {
      setIsEditMode(true);
      onSectionEdit(sectionId);
      if (onEdit) onEdit();
    }
  };

  const handleTextClose = () => {
    setIsEditMode(false);
    setEditedName(originalName); // Revert to original value
    onSectionClose();
  };

  const handleTextUpdate = () => {
    setIsEditMode(false);
    setOriginalName(editedName); // Update original value with edited value
    onSectionClose();
  };

  const handleNameChange = (value: string) => {
    setEditedName(value);
    if (onNameChange) onNameChange(value);
  };

  const isEditDisabled =
    editingSection !== null && editingSection !== sectionId;

  return (
    <div
      className={`rounded-xl p-6 flex flex-col gap-4 ${
        isEditMode ? "bg-card-open-fill" : "bg-card-close-fill"
      }`}
    >
      <SectionHeader
        title={messages?.portfolio?.name}
        onEdit={handleEdit}
        onTextCancel={handleTextClose}
        showEditButton={!isEditMode}
        showTextCloseButton={isEditMode}
        editDisabled={isEditDisabled}
      />
      <CustomInput
        label={messages?.portfolio?.name}
        value={editedName} // Use edited value
        onChange={handleNameChange}
        readOnly={!isEditing}
        isEditing={isEditing}
      />
      {isEditMode && (
        <div className="flex flex-col gap-3">
          <PixieButton
            label="Update"
            disabled={false}
            onClick={handleTextUpdate}
            className="w-full"
          />
          <CancelButton onClick={handleTextClose} />
        </div>
      )}
    </div>
  );
};
