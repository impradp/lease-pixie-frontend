"use client";

import React, { useState } from "react";
import { Property } from "@/types/Property";
import { Portfolio } from "@/types/Portfolio";
import PixieTab from "@/components/ui/tab/PixieTab";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import { PropertyAndPortfolioTab } from "@/components/dashboard/PropertyAndPortfolioTab";

interface PropertyAndPortfolioCardProps {
  isEditable?: boolean;
  onSearchChange?: (value: string) => void;
  portfolios?: Portfolio[];
  properties?: Property[];
}

const PropertyAndPortfolioCard: React.FC<PropertyAndPortfolioCardProps> = ({
  isEditable = false,
  onSearchChange,
  portfolios = [],
  properties = [],
}) => {
  const tabs = [
    { label: "Property list", value: "properties" },
    { label: "Portfolio list", value: "portfolios" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[1].value); // Default to "portfolios"

  const handleTabClick = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="relative w-[408px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
      {/* Workflow Header */}
      <div className="w-full">
        <PixieCardHeader
          label={"Properties and Portfolios"}
          isEditable={isEditable}
          onSearchChange={onSearchChange}
          showSearchFeat={true}
          showSearchIcon={true}
        />
      </div>

      {/* Tabbed Section */}
      <div className="mt-4 flex flex-col gap-4">
        <PixieTab
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={handleTabClick}
        />
        <PropertyAndPortfolioTab
          activeTab={activeTab}
          portfolios={portfolios}
          properties={properties}
        />
      </div>
    </div>
  );
};

export default PropertyAndPortfolioCard;
