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
  defaultSearchTerm?: string; // Default search term for the card
}

/**
 * Renders a card with tabbed views for properties and portfolios
 * @param props - The properties for configuring the card
 * @returns JSX.Element - The rendered property and portfolio card
 */
const PropertyAndPortfolioCard: React.FC<PropertyAndPortfolioCardProps> = ({
  isEditable = false,
  isSubmitting,
  defaultSearchTerm = "", // Default search term for the card
}) => {
  const [isRefreshClicked, setIsRefreshClicked] = useState(false);
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredPortfolios, setFilteredPortfolios] = useState<Portfolio[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  // Update searchTerm when defaultSearchTerm prop changes
  useEffect(() => {
    setSearchTerm(defaultSearchTerm);
  }, [defaultSearchTerm]);

  // Handle search input changes
  const onSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const filterPortfolios = useCallback(
    (portfoliosToFilter: Portfolio[], term: string) => {
      if (!term) return portfoliosToFilter;

      return portfoliosToFilter.filter((portfolio) => {
        // Check all searchable fields
        const searchableFields = [
          portfolio.name,
          portfolio.id,
          // Add any other relevant portfolio fields here
        ].filter(Boolean); // Remove null/undefined values

        return searchableFields.some((field) =>
          field?.toLowerCase().includes(term.toLowerCase())
        );
      });
    },
    []
  );

  const filterProperties = useCallback(
    (propertiesToFilter: Property[], term: string) => {
      if (!term) return propertiesToFilter;

      return propertiesToFilter.filter((property) => {
        // Check all searchable fields
        const searchableFields = [
          property.name,
          property.address,
          // Add any other relevant property fields here
        ].filter(Boolean); // Remove null/undefined values

        return searchableFields.some((field) =>
          field?.toLowerCase().includes(term.toLowerCase())
        );
      });
    },
    []
  );

  // Apply filters whenever data or search term changes
  useEffect(() => {
    setFilteredPortfolios(filterPortfolios(portfolios, searchTerm));
    setFilteredProperties(filterProperties(properties, searchTerm));
  }, [properties, portfolios, searchTerm, filterPortfolios, filterProperties]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      isSubmitting(true);
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
  const onRefreshClick = async () => {
    setIsRefreshClicked(true);
    // Clear search on refresh and ensure the value is propagated to the header
    setSearchTerm("");

    // Re-fetch data
    isSubmitting(true);
    try {
      const [portfolioResponse, propertyResponse] = await Promise.all([
        portfolioService.fetchAll(),
        propertyService.fetchAll(),
      ]);

      if (portfolioResponse.status === "SUCCESS") {
        setPortfolios(portfolioResponse.data);
      }

      if (propertyResponse.status === "SUCCESS") {
        setProperties(propertyResponse.data);
      }
    } catch (err) {
      handleInfo({ code: 100514, error: err });
    } finally {
      isSubmitting(false);
      setTimeout(() => setIsRefreshClicked(false), 500); // Reset after 500ms
    }
  };

  // Define tabs
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
        globalSearchValue={searchTerm} // Pass current search value to header
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
