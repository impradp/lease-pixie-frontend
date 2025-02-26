import React, { useState } from "react";
import { CustomInput } from "@/components/ui/CustomInput";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getMessages } from "@/locales/loader";
import { Locale } from "@/locales";

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

  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);

  return (
    <div className=" bg-card-open-fill rounded-xl p-6 flex flex-col gap-4">
      <SectionHeader
        title={messages?.portfolio?.name}
        onEdit={onEdit}
        showEditButton={isExistingPortfolio}
      />
      <CustomInput
        label={messages?.portfolio?.name}
        value={portfolioName}
        onChange={onNameChange}
        readOnly={isExistingPortfolio && !onNameChange}
        isEditing={isEditing}
      />
    </div>
  );
};
