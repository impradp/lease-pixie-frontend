"use client";

import React from "react";
import { Property } from "@/types/Property";
import { Portfolio } from "@/types/Portfolio";
import PropertyTabContent from "@/components/dashboard/PropertyTabContent";
import PortfolioTabContent from "@/components/dashboard/PortfolioTabContent";

interface PropertyAndPortfolioTabProps {
  activeTab: string;
  portfolios: Portfolio[];
  properties: Property[];
}

export const PropertyAndPortfolioTab: React.FC<
  PropertyAndPortfolioTabProps
> = ({ activeTab, portfolios, properties }) => {
  return (
    <div className="w-full">
      {activeTab === "properties" ? (
        <PropertyTabContent properties={properties} />
      ) : (
        <PortfolioTabContent portfolios={portfolios} />
      )}
    </div>
  );
};
