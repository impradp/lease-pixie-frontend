"use client";

import React, { useState, useEffect, useCallback } from "react";

import { hasRole } from "@/lib/utils/authUtils";
import { PortfolioUser } from "@/types/Portfolio";
import handleInfo from "@/lib/utils/errorHandler";
import { portfolioService } from "@/lib/services/portfolio";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import PreConfirmationDialog from "@/components/ui/dialog/PreConfirmationDialog";
import PortfolioUserCardContent from "@/components/dashboard/portfolio/PortfolioUserCardContent";

/**
 * Props for the PortfolioUsers component
 */
interface PortfolioUsersCardProps {
  isEditable: boolean; // Whether the card is editable (default: false)
  isSubmitting: (value: boolean) => void;
  defaultSearchTerm?: string; // Default search term for the card
}

/**
 * Renders a card displaying a searchable list of portfolio users
 * @returns JSX.Element - The rendered portfolio users card
 */
const PortfolioUsersCard: React.FC<PortfolioUsersCardProps> = ({
  isEditable = false,
  isSubmitting,
  defaultSearchTerm = "", // Default search term for the card
}) => {
  const [isRefreshClicked, setIsRefreshClicked] = useState(false);
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);
  const [portfolioUsers, setPortfolioUsers] = useState<PortfolioUser[]>([]);
  const [filteredPortfolioUsers, setFilteredPortfolioUsers] = useState<
    PortfolioUser[]
  >([]);
  const [showPreConfirmationDialog, setShowPreConfirmationDialog] =
    useState(false);
  const [selectedPortfolioUser, setSelectedPortfolioUser] =
    useState<PortfolioUser>();

  const hasAccountPermission = hasRole("ACCOUNTUSER") ?? false;

  // Update searchTerm when defaultSearchTerm prop changes
  useEffect(() => {
    setSearchTerm(defaultSearchTerm);
  }, [defaultSearchTerm]);

  // Handle search input changes
  const onSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const filterPortfolioUsers = useCallback(
    (usersToFilter: PortfolioUser[], term: string) => {
      if (!term) return usersToFilter;

      const lowerCaseTerm = term.toLowerCase();

      return usersToFilter.filter((user) => {
        // Check basic user fields
        const basicFieldsMatch = [
          user.firstName,
          user.lastName,
          user.mobileNumber,
        ].some((field) => field?.toLowerCase().includes(lowerCaseTerm));

        if (basicFieldsMatch) return true;

        // Check portfolio list (if it exists)
        if (user.portfolioList && Array.isArray(user.portfolioList)) {
          // Check if any portfolio id or name contains the search term
          return user.portfolioList.some(
            (portfolio) =>
              portfolio.code?.toLowerCase().includes(lowerCaseTerm) ||
              portfolio.name?.toLowerCase().includes(lowerCaseTerm)
          );
        }

        return false;
      });
    },
    []
  );

  useEffect(() => {
    setFilteredPortfolioUsers(filterPortfolioUsers(portfolioUsers, searchTerm));
  }, [portfolioUsers, searchTerm, filterPortfolioUsers]);

  const fetchPortfolioUsers = async () => {
    isSubmitting(true);
    try {
      const response = await portfolioService.getUsers({
        attachPortfolio: true,
      });
      if (response.status === "SUCCESS") {
        setPortfolioUsers(response?.data);
      } else {
        handleInfo({ code: 100501 });
      }
    } catch (err) {
      handleInfo({ code: 100502, error: err });
    } finally {
      isSubmitting(false);
    }
  };

  useEffect(() => {
    fetchPortfolioUsers();
  }, []);

  // Handle refresh button click
  const onRefreshClick = async () => {
    setIsRefreshClicked(true);
    setSearchTerm(""); // Clear search on refresh

    // Re-fetch data
    await fetchPortfolioUsers();

    setTimeout(() => setIsRefreshClicked(false), 500); // Reset after 500ms
  };

  const onClickDelete = async (user: PortfolioUser) => {
    setShowPreConfirmationDialog(true);
    setSelectedPortfolioUser(user);
  };

  const handlePreConfirmationClose = () => {
    setShowPreConfirmationDialog(false);
    setSelectedPortfolioUser(undefined);
  };

  // Handle delete action (placeholder for API call)
  const handleDelete = async () => {
    try {
      isSubmitting(true);
      setShowPreConfirmationDialog(false);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (!selectedPortfolioUser?.id) {
        throw new Error("Invalid user id.");
      }
      const response = await portfolioService.deleteUser(
        selectedPortfolioUser.id
      );

      if (response?.status === "SUCCESS") {
        handleInfo({ code: 100515 });
        fetchPortfolioUsers();
      } else {
        handleInfo({ code: 100516 });
      }
    } catch (err) {
      handleInfo({ code: 100517, error: err });
    } finally {
      isSubmitting(false);
    }
  };

  return (
    <>
      <div className="relative w-[408px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
        <PixieCardHeader
          label="Portfolio Users"
          isEditable={isEditable}
          onSearchChange={onSearchChange}
          globalSearchValue={searchTerm} // Pass current search term to header
          showSearchFeat={true}
          showRefreshIcon={true}
          onRefreshClick={onRefreshClick}
          isRefreshClicked={isRefreshClicked}
          showSearchIcon={true}
        />

        <div className="flex flex-col gap-2">
          {filteredPortfolioUsers.length === 0 && (
            <div className="self-stretch p-2 bg-secondary-fill rounded-md inline-flex flex-col justify-start items-start gap-1 overflow-hidden">
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <div className="flex-1 justify-start text-dropdown-regular text-xs font-normal font-['Inter'] leading-[18px]">
                      No portfolio user available matching your search.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {filteredPortfolioUsers.map((user: PortfolioUser) => (
            <PortfolioUserCardContent
              key={user.id}
              user={user}
              isEditable={hasAccountPermission}
              onDelete={onClickDelete}
            />
          ))}
        </div>
      </div>
      <PreConfirmationDialog
        isOpen={showPreConfirmationDialog}
        onClose={handlePreConfirmationClose}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message="Delete portfolio user. This action will archive the portfolio user and cannot be undone."
        confirmButtonLabel="Delete"
      />
    </>
  );
};

export default PortfolioUsersCard;
