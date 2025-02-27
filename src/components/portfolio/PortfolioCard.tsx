import React, { useState } from "react";
import { CustomInput } from "@/components/ui/CustomInput";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getMessages } from "@/locales/loader";
import { Locale } from "@/locales";
import PixieButton from "@/components/buttons/PixieButton";
import CancelButton from "@/components/buttons/CancelButton";

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
  const isEditing = isEditMode; // Editing is only true when in edit mode

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
    onSectionClose();
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
        showEditButton={!isEditMode} // Show Edit button when not in edit mode
        showTextCloseButton={isEditMode} // Show Cancel button when in edit mode
        editDisabled={isEditDisabled}
      />
      <CustomInput
        label={messages?.portfolio?.name}
        value={portfolioName}
        onChange={onNameChange}
        readOnly={!isEditing} // Read-only unless in edit mode
        isEditing={isEditing} // Enable editing UI only when in edit mode
      />
      {isEditMode && (
        <div className="flex flex-col gap-3">
          <PixieButton
            label="Update"
            disabled={false}
            onClick={handleTextClose}
            className="w-full"
          />
          <CancelButton onClick={handleTextClose} />
        </div>
      )}
    </div>
  );
};
