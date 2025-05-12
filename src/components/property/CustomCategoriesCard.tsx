import React, { useEffect, useState } from "react";

import { hasRole } from "@/lib/utils/authUtils";
import SectionHeader from "@/components/ui/header/SectionHeader";

interface CustomCategoriesCardProps {
  sectionName: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
}

const CustomCategoriesCard: React.FC<CustomCategoriesCardProps> = ({
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
        title={"Custom Categories  (0)"}
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
        infoContent="Invoice Categories:  used to categorize deposit account transactions.  Default values are used for system generated invoices (i.e. base rent, additional rent); however, you may add categories if needed."
      />
    </div>
  );
};

export default CustomCategoriesCard;
