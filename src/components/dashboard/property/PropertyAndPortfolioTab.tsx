"use client";

import React from "react";
import { Portfolio } from "@/types/Portfolio";
import { PropertyInfoData } from "@/types/PropertyInfo";
import PropertyTabContent from "@/components/dashboard/property/PropertyTabContent";
import PortfolioTabContent from "@/components/dashboard/portfolio/PortfolioTabContent";

/**
 * Props for the PropertyAndPortfolioTab component
 */
interface PropertyAndPortfolioTabProps {
  activeTab: string; // The currently active tab ("properties" or "portfolios")
  portfolios: Portfolio[]; // List of portfolios to display
  properties: PropertyInfoData[]; // List of properties to display
  isEditable?: boolean;
  onEditClick?: (portfolioId: number) => void;
}

/**
 * Renders the content for the active tab, either properties or portfolios
 * @param props - The properties for configuring the tab content
 * @returns JSX.Element - The rendered tab content
 */
const PropertyAndPortfolioTab: React.FC<PropertyAndPortfolioTabProps> = ({
  activeTab,
  portfolios,
  properties,
  isEditable = false,
  onEditClick,
}) => {
  return (
    <div className="w-full">
      {activeTab === "properties" ? (
        <PropertyTabContent properties={properties} />
      ) : (
        <PortfolioTabContent
          portfolios={portfolios}
          isEditable={isEditable}
          onEditClick={onEditClick}
        />
      )}
    </div>
  );
};

export default PropertyAndPortfolioTab;
