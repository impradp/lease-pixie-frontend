//This component is used to display the card functionality like edit/close and section display
import React, { useState } from "react";
import PixieButton from "@/components/ui/buttons/PixieButton";
import LinkButton from "@/components/ui/buttons/LinkButton";
import SectionHeader from "@/components/ui/header/SectionHeader";

interface CardProps {
  onEdit?: () => void;
  sectionId: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  handleCardUpdate: () => void;
  onSectionClose: () => void;
}

const Card: React.FC<CardProps> = ({
  onEdit,
  sectionId,
  editingSection,
  onSectionEdit,
  onSectionClose,
  handleCardUpdate,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

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

  const handleUpdate = () => {
    setIsEditMode(false);
    handleCardUpdate();
    onSectionClose();
  };

  const isEditDisabled =
    editingSection !== null && editingSection !== sectionId;

  return (
    <div
      className={`flex items-center rounded-xl p-6 flex flex-col gap-4 ${
        isEditMode ? "bg-card-open-fill" : "bg-card-close-fill"
      }`}
    >
      <SectionHeader
        title={"Card Title"}
        onEdit={handleEdit}
        onTextCancel={handleTextClose}
        showEditButton={!isEditMode}
        showTextCloseButton={isEditMode}
        editDisabled={isEditDisabled}
      />

      {isEditMode && (
        <div className="w-full flex flex-col gap-3">
          <PixieButton
            label="Continue"
            disabled={false}
            onClick={handleUpdate}
            className="w-full"
          />
          <LinkButton onClick={handleTextClose} />
        </div>
      )}
    </div>
  );
};

export default Card;
