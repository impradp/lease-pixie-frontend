import React, { useState, useEffect } from "react";
import { Locale } from "@/locales";
import { getMessages } from "@/locales/locale";
import CustomInput from "@/components/ui/input/CustomInput";
import PixieButton from "@/components/ui/buttons/PixieButton";
import LinkButton from "@/components/ui/buttons/LinkButton";
import { SectionHeader } from "@/components/ui/header/SectionHeader";

interface PortfolioCardProps {
  portfolioName: string;
  onNameChange?: (name: string) => void;
  sectionId: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
  onClickUpdate?: () => void;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  portfolioName,
  onNameChange,
  sectionId,
  editingSection,
  onSectionEdit,
  onSectionClose,
  onClickUpdate,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalName, setOriginalName] = useState(portfolioName);
  const [editedName, setEditedName] = useState(portfolioName);
  const isEditing = isEditMode;

  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);

  // Sync original and edited name with props when they change
  useEffect(() => {
    setOriginalName(portfolioName);
    setEditedName(portfolioName);
  }, [portfolioName]);

  const handleEdit = () => {
    if (editingSection === null || editingSection === sectionId) {
      setIsEditMode(true);
      onSectionEdit(sectionId);
    }
  };

  const handleTextClose = () => {
    setIsEditMode(false);
    setEditedName(originalName); // Revert to original value
    onSectionClose();
  };

  const handleTextUpdate = async () => {
    setIsEditMode(false);
    if (onNameChange && editedName) {
      await new Promise((resolve) => {
        onNameChange(editedName);
        resolve(true);
      });
    }
    onClickUpdate?.();
    onSectionClose();
  };

  const handleNameChange = (value: string) => {
    if (isEditing) {
      setEditedName(value);
    }
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
        value={editedName}
        onChange={handleNameChange}
        readOnly={!isEditing}
        isEditing={isEditing}
        isRequired={true}
      />
      {isEditMode && (
        <div className="flex flex-col gap-3">
          <PixieButton
            label="Update"
            disabled={false}
            onClick={handleTextUpdate}
            className="w-full"
          />
          <div className="flex justify-center">
            <LinkButton onClick={handleTextClose} />
          </div>
        </div>
      )}
    </div>
  );
};
