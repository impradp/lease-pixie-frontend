"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Property } from "@/types/Property";
import { Portfolio } from "@/types/Portfolio";
import handleInfo from "@/lib/utils/errorHandler";
import PixieTab from "@/components/ui/tab/PixieTab";
import { propertyService } from "@/lib/services/property";
import { portfolioService } from "@/lib/services/portfolio";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import PropertyAndPortfolioTab from "@/components/dashboard/property/PropertyAndPortfolioTab";

/**
 * Props for the PropertyAndPortfolioCard component
 */
interface PropertyAndPortfolioCardProps {
  isEditable: boolean; // Whether the card is editable (default: false)
  isSubmitting: (value: boolean) => void;
}

/**
 * Renders a card with tabbed views for properties and portfolios
 * @param props - The properties for configuring the card
 * @returns JSX.Element - The rendered property and portfolio card
 */
const PropertyAndPortfolioCard: React.FC<PropertyAndPortfolioCardProps> = ({
  isEditable = false,
  isSubmitting,
}) => {
  const [isRefreshClicked, setIsRefreshClicked] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredPortfolios, setFilteredPortfolios] = useState<Portfolio[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  // Handle search input changes
  const onSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const filterPortfolios = useCallback(
    (portfoliosToFilter: Portfolio[], term: string) => {
      return portfoliosToFilter.filter((portfolio) =>
        [portfolio.name].some((field) =>
          field?.toLowerCase().includes(term.toLowerCase())
        )
      );
    },
    []
  );

  const filterProperties = useCallback(
    (propertiesToFilter: Property[], term: string) => {
      return propertiesToFilter.filter((property) =>
        [property.name].some((field) =>
          field?.toLowerCase().includes(term.toLowerCase())
        )
      );
    },
    []
  );

  useEffect(() => {
    setFilteredPortfolios(filterPortfolios(portfolios, searchTerm));
    setFilteredProperties(filterProperties(properties, searchTerm));
  }, [properties, portfolios, searchTerm, filterPortfolios, filterProperties]);

  useEffect(() => {
    const fetchData = async () => {
      isSubmitting(true);
      setSearchTerm(""); // Reset search term on fetch
      try {
        const [portfolioResponse, propertyResponse] = await Promise.all([
          portfolioService.fetchAll(),
          propertyService.fetchAll(),
        ]);

        if (portfolioResponse.status === "SUCCESS") {
          setPortfolios(portfolioResponse.data);
        } else {
          handleInfo({ code: 100513 });
        }

        if (propertyResponse.status === "SUCCESS") {
          setProperties(propertyResponse.data);
        } else {
          handleInfo({ code: 100603 });
        }
      } catch (err) {
        handleInfo({ code: 100514, error: err });
      } finally {
        isSubmitting(false);
      }
    };

    fetchData();
  }, []);

  // Handle refresh button click
  const onRefreshClick = () => {
    setIsRefreshClicked(true);
    setSearchTerm("");
    setTimeout(() => setIsRefreshClicked(false), 500); // Reset after 500ms
  };

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
        showRefreshIcon={true}
        onRefreshClick={onRefreshClick}
        isRefreshClicked={isRefreshClicked}
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
          portfolios={filteredPortfolios}
          properties={filteredProperties}
        />
      </div>
    </div>
  );
};

export default PropertyAndPortfolioCard;
