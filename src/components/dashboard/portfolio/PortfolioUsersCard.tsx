"use client";

import React, { useState } from "react";
import { samplePortfolioUser } from "@/data/users";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import PortfolioUserCardContent from "@/components/dashboard/portfolio/PortfolioUserCardContent";

/**
 * Renders a card displaying a searchable list of portfolio users
 * @returns JSX.Element - The rendered portfolio users card
 */
const PortfolioUsersCard: React.FC = () => {
  const [isRefreshClicked, setIsRefreshClicked] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle search input changes
  const onSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Handle refresh button click
  const onRefreshClick = () => {
    setIsRefreshClicked(true);
    setSearchTerm("");
    setTimeout(() => setIsRefreshClicked(false), 500); // Reset after 500ms
  };

  // Filter users based on search term
  const filteredPortfolioUsers = samplePortfolioUser.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-[408px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
      <PixieCardHeader
        label="Portfolio Users"
        isEditable={true}
        onSearchChange={onSearchChange}
        showSearchFeat={true}
        showRefreshIcon={true}
        onRefreshClick={onRefreshClick}
        isRefreshClicked={isRefreshClicked}
        showSearchIcon={true}
      />
      {filteredPortfolioUsers.map((user) => (
        <PortfolioUserCardContent key={user.id} user={user} />
      ))}
    </div>
  );
};

export default PortfolioUsersCard;
