"use client";

import React, { useState, useEffect, useCallback } from "react";

import { PortfolioUser } from "@/types/Portfolio";
import handleInfo from "@/lib/utils/errorHandler";
import { portfolioService } from "@/lib/services/portfolio";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import PortfolioUserCardContent from "@/components/dashboard/portfolio/PortfolioUserCardContent";

/**
 * Props for the PortfolioUsers component
 */
interface PortfolioUsersCardProps {
  isEditable: boolean; // Whether the card is editable (default: false)
  isSubmitting: (value: boolean) => void;
}

/**
 * Renders a card displaying a searchable list of portfolio users
 * @returns JSX.Element - The rendered portfolio users card
 */
const PortfolioUsersCard: React.FC<PortfolioUsersCardProps> = ({
  isEditable = false,
  isSubmitting,
}) => {
  const [isRefreshClicked, setIsRefreshClicked] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [portfolioUsers, setPortfolioUsers] = useState<PortfolioUser[]>([]);
  const [filteredPortfolioUsers, setFilteredPortfolioUsers] = useState<
    PortfolioUser[]
  >([]);

  // Handle search input changes
  const onSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const filterPortfolioUsers = useCallback(
    (usersToFilter: PortfolioUser[], term: string) => {
      return usersToFilter.filter((user) =>
        [user.firstName, user.lastName, user.mobileNumber].some((field) =>
          field?.toLowerCase().includes(term.toLowerCase())
        )
      );
    },
    []
  );

  useEffect(() => {
    setFilteredPortfolioUsers(filterPortfolioUsers(portfolioUsers, searchTerm));
  }, [portfolioUsers, searchTerm, filterPortfolioUsers]);

  const fetchPortfolioUsers = async () => {
    isSubmitting(true);
    setSearchTerm(""); // Reset search term on fetch
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
  const onRefreshClick = () => {
    setIsRefreshClicked(true);
    setSearchTerm("");
    setTimeout(() => setIsRefreshClicked(false), 500); // Reset after 500ms
  };

  return (
    <div className="relative w-[408px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
      <PixieCardHeader
        label="Portfolio Users"
        isEditable={isEditable}
        onSearchChange={onSearchChange}
        showSearchFeat={true}
        showRefreshIcon={true}
        onRefreshClick={onRefreshClick}
        isRefreshClicked={isRefreshClicked}
        showSearchIcon={true}
      />
      <div className="flex flex-col gap-2">
        {filteredPortfolioUsers.map((user: PortfolioUser) => (
          <PortfolioUserCardContent key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default PortfolioUsersCard;
