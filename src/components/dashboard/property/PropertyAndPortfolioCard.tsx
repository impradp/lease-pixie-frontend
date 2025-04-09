"use client";

import React, { useState } from "react";
import { Property } from "@/types/Property";
import { Portfolio } from "@/types/Portfolio";
import PixieTab from "@/components/ui/tab/PixieTab";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import PropertyAndPortfolioTab from "@/components/dashboard/property/PropertyAndPortfolioTab";

/**
 * Props for the PropertyAndPortfolioCard component
 */
interface PropertyAndPortfolioCardProps {
  isEditable?: boolean; // Whether the card allows editing
  onSearchChange?: (value: string) => void; // Callback for search input changes
  portfolios?: Portfolio[]; // List of portfolios to display
  properties?: Property[]; // List of properties to display
}

/**
 * Renders a card with tabbed views for properties and portfolios
 * @param props - The properties for configuring the card
 * @returns JSX.Element - The rendered property and portfolio card
 */
const PropertyAndPortfolioCard: React.FC<PropertyAndPortfolioCardProps> = ({
  isEditable = false,
  onSearchChange,
  portfolios = [],
  properties = [],
}) => {
  // Define tabs outside of render to avoid recreation
  const tabs = [
    { label: "Property list", value: "properties" },
    { label: "Portfolio list", value: "portfolios" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[1].value); // Default to "portfolios"

  // Handle tab switching
  const handleTabClick = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="relative w-[408px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
      <PixieCardHeader
        label="Properties and Portfolios"
        isEditable={isEditable}
        onSearchChange={onSearchChange}
        showSearchFeat={true}
        showSearchIcon={true}
      />
      <div className="flex flex-col gap-4">
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
