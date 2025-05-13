"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";

import { Account } from "@/types/Account";
import { useRouter } from "next/navigation";
import { Portfolio } from "@/types/Portfolio";
import { hasRole } from "@/lib/utils/authUtils";
import handleInfo from "@/lib/utils/errorHandler";
import PixieTab from "@/components/ui/tab/PixieTab";
import { interpolate } from "@/lib/utils/stringUtils";
import { propertyService } from "@/lib/services/property";
import { portfolioService } from "@/lib/services/portfolio";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import PreConfirmationDialog from "@/components/ui/dialog/PreConfirmationDialog";
import PropertyAndPortfolioTab from "@/components/dashboard/property/PropertyAndPortfolioTab";
import { PropertyInfoData } from "@/types/PropertyInfo";

/**
 * Props for the PropertyAndPortfolioCard component
 */
interface PropertyAndPortfolioCardProps {
  isEditable: boolean; // Whether the card is editable (default: false)
  isSubmitting: (value: boolean) => void;
  defaultSearchTerm?: string; // Default search term for the card
  showAll?: boolean;
  accountDetails?: Account;
}

/**
 * Renders a card with tabbed views for properties and portfolios
 * @param props - The properties for configuring the card
 * @returns JSX.Element - The rendered property and portfolio card
 */
const PropertyAndPortfolioCard = ({
  isEditable = false,
  isSubmitting,
  defaultSearchTerm = "",
  showAll = false,
  accountDetails,
}: PropertyAndPortfolioCardProps) => {
  const [isRefreshClicked, setIsRefreshClicked] = useState(false);
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [properties, setProperties] = useState<PropertyInfoData[]>([]);
  const [showPreConfirmationDialog, setShowPreConfirmationDialog] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("portfolios");

  const router = useRouter();

  const hasCreateAccess = hasRole("AccountUser") ?? false;

  // Update searchTerm when defaultSearchTerm prop changes
  useEffect(() => {
    setSearchTerm(defaultSearchTerm);
  }, [defaultSearchTerm]);

  // Handle search input changes
  const onSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const filterPortfolios = useCallback(
    (portfoliosToFilter: Portfolio[], term: string) => {
      if (!term) return portfoliosToFilter;

      return portfoliosToFilter.filter((portfolio) => {
        // Check all searchable fields
        const searchableFields = [
          portfolio.name,
          portfolio.code,
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
    (propertiesToFilter: PropertyInfoData[], term: string) => {
      if (!term) return propertiesToFilter;

      return propertiesToFilter.filter((property) => {
        // Check all searchable fields
        const searchableFields = [
          property.propertyTitle,
          property.propertyEntityName,
          // Add any other relevant property fields here
        ].filter(Boolean); // Remove null/undefined values

        return searchableFields.some((field) =>
          field?.toLowerCase().includes(term.toLowerCase())
        );
      });
    },
    []
  );

  const filteredPortfolios = useMemo(
    () => filterPortfolios(portfolios, searchTerm),
    [portfolios, searchTerm, filterPortfolios]
  );

  const filteredProperties = useMemo(
    () => filterProperties(properties, searchTerm),
    [properties, searchTerm, filterProperties]
  );

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!showAll && !accountDetails?.id) {
      return;
    }
    isSubmitting(true);
    try {
      let portfolioResponse, propertyResponse;
      if (showAll) {
        [portfolioResponse, propertyResponse] = await Promise.all([
          portfolioService.fetchAll(),
          propertyService.fetchAll(),
        ]);
      } else if (accountDetails?.id) {
        [portfolioResponse, propertyResponse] = await Promise.all([
          portfolioService.fetchByAccountId(accountDetails?.id),
          propertyService.fetchByAccountId(accountDetails?.id),
        ]);
      }

      if (portfolioResponse?.status === "SUCCESS") {
        setPortfolios(portfolioResponse.data);
      } else {
        handleInfo({ code: 100513 });
      }

      if (propertyResponse?.status === "SUCCESS") {
        setProperties(propertyResponse.data);
      } else {
        handleInfo({ code: 100603 });
      }
    } catch (err) {
      handleInfo({ code: 100514, error: err });
    } finally {
      isSubmitting(false);
    }
  }, [accountDetails?.id, showAll, isSubmitting]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle refresh button click
  const onRefreshClick = useCallback(async () => {
    setIsRefreshClicked(true);
    setSearchTerm(""); // Clear search on refresh

    // Re-fetch data
    await fetchData();

    setTimeout(() => setIsRefreshClicked(false), 500); // Reset after 500ms
  }, [fetchData]);

  // Define tabs
  const tabs = [
    { label: "Property list", value: "properties" },
    { label: "Portfolio list", value: "portfolios" },
  ];

  // Handle tab switching
  const handleTabClick = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  const handleEditClick = (portfolioId: number) => {
    isSubmitting(true);
    router.push(interpolate("/portfolio?id=%s", portfolioId));
  };

  // Confirm to continue to portfolio creation
  const handleAdd = () => {
    setShowPreConfirmationDialog(true);
  };

  // Refirect account user to portfolio creation page
  const handleCreatePortfolio = () => {
    setShowPreConfirmationDialog(false);
    isSubmitting(true);
    router.push("/portfolio");
  };

  return (
    <>
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
          showAddIcon={hasCreateAccess && isEditable}
          onAddClick={handleAdd}
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
            isEditable={isEditable}
            onEditClick={handleEditClick}
          />
        </div>
      </div>
      <PreConfirmationDialog
        isOpen={showPreConfirmationDialog}
        onClose={() => setShowPreConfirmationDialog(false)}
        onConfirm={handleCreatePortfolio}
        title="Confirm Portfolio Creation"
        message="Continue to portfolio creation. This action will redirect you to the portfolio creation page."
        confirmButtonLabel="Continue"
      />
    </>
  );
};

export default PropertyAndPortfolioCard;
