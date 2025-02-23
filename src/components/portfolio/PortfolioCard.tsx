import React from "react";
import { CustomInput } from "@/components/ui/CustomInput";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface PortfolioCardProps {
  portfolioName: string;
  onEdit?: () => void;
  isExistingPortfolio?: boolean;
  onNameChange?: (name: string) => void;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  portfolioName,
  onEdit,
  isExistingPortfolio = false,
  onNameChange,
}) => {
  const isEditing = !isExistingPortfolio || !!onNameChange;

  return (
    <div className=" bg-[#f2f2f2] rounded-xl p-6 flex flex-col gap-4">
      <SectionHeader
        title="Portfolio Name"
        onEdit={onEdit}
        showEditButton={isExistingPortfolio}
      />
      <CustomInput
        label="Portfolio name"
        value={portfolioName}
        onChange={onNameChange}
        readOnly={isExistingPortfolio && !onNameChange}
        isEditing={isEditing}
      />
    </div>
  );
};
