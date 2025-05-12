import React, { useEffect, useState } from "react";

import { hasRole } from "@/lib/utils/authUtils";
import SectionHeader from "@/components/ui/header/SectionHeader";

interface ScheduledWorkCardProps {
  sectionName: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
}

const ScheduledWorkCard: React.FC<ScheduledWorkCardProps> = ({
  sectionName,
  editingSection,
  onSectionEdit,
  onSectionClose,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const [portfolioUserAccess, setPortfolioUserAccess] = useState(false);

  const hasAccountUserAccess = hasRole("AccountUser");

  // Move the access check into useEffect to avoid infinite renders
  useEffect(() => {
    // TODO: Check with the API whether settings card is accessible for edit
    // For now, setting a default value that won't cause infinite renders
    setPortfolioUserAccess(false);
  }, []); // Empty dependency array means this runs once on mount

  // Handle edit button click
  const handleEdit = () => {
    if (editingSection === null || editingSection === sectionName) {
      onSectionEdit(sectionName);
      setIsEditMode(true);
    }
  };

  // Handle cancel button click
  const handleTextClose = () => {
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
      <SectionHeader
        title={"Scheduled Work (0)"}
        onEdit={handleEdit}
        onTextCancel={handleTextClose}
        showEditButton={!isEditMode}
        showTextCloseButton={isEditMode}
        editDisabled={isEditDisabled}
        cardActionContent="Portfolio User %s Edit"
        hasAccess={portfolioUserAccess}
        showCardActionContent={hasAccountUserAccess}
        onAccessToggle={(val) => setPortfolioUserAccess(val)}
        showInfo={true}
        infoContent="Scheduled Work:  a versatile way to schedule annual or repetitive tasks which will be completed by a procure vendor contract, or procure vendor service, workflow."
      />
    </div>
  );
};

export default ScheduledWorkCard;
