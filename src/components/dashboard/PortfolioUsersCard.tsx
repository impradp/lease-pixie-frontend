"use client";

import React, { useState } from "react";
import { samplePortfolioUser } from "@/data/users";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import PortfolioUserCardContent from "@/components/dashboard/PortfolioUserCardContent";

const PortfolioUsersCard: React.FC = () => {
  const [isRefreshClicked, setIsRefreshClicked] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const onSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const filteredPortfolioUsers = samplePortfolioUser.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onRefreshClick = () => {
    setIsRefreshClicked(true); // Set clicked state
    setSearchTerm(""); // Reset search term to empty, which resets the filtered list
    // Reset isRefreshClicked after a short delay (e.g., 500ms)
    setTimeout(() => {
      setIsRefreshClicked(false);
    }, 500);
  };

  return (
    <div className="relative w-[408px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
      {/* Workflow Header */}
      <div className="w-full">
        <PixieCardHeader
          label={"Portfolio Users"}
          isEditable={true}
          onSearchChange={onSearchChange}
          showSearchFeat={true}
          showRefreshIcon={true}
          onRefreshClick={onRefreshClick}
          isRefreshClicked={isRefreshClicked}
          showSearchIcon={true}
        />
      </div>

      {/* User Card Content */}
      {filteredPortfolioUsers.map((user) => (
        <PortfolioUserCardContent key={user.id} user={user} />
      ))}
    </div>
  );
};

export default PortfolioUsersCard;
