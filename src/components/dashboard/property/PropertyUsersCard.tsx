"use client";

import React, { useState } from "react";
import { samplePropertyUser } from "@/data/propertyUsers";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import PropertyUsersCardContent from "@/components/dashboard/property/PropertyUsersCardContent";

/**
 * Renders a card displaying a searchable list of property users with privilege controls
 * @returns JSX.Element - The rendered property users card
 */
const PropertyUsersCard: React.FC = () => {
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

  // Handle privilege button click (placeholder for API call)
  const handlePrivilegeClick = () => {
    // TODO: Implement API call to update access roles for properties
  };

  // Filter users based on search term
  const filteredPropertyUsers = samplePropertyUser.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-[408px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
      <PixieCardHeader
        label="Property Users"
        isEditable={true}
        onSearchChange={onSearchChange}
        showSearchFeat={true}
        showRefreshIcon={true}
        onRefreshClick={onRefreshClick}
        isRefreshClicked={isRefreshClicked}
        showSearchIcon={true}
      />
      <div className="flex flex-col gap-2">
        {filteredPropertyUsers.map((user) => (
          <PropertyUsersCardContent
            key={user.id}
            user={user}
            onPrivilegeClick={handlePrivilegeClick}
          />
        ))}
        {filteredPropertyUsers?.length === 0 && (
          <div className="self-stretch p-2 bg-secondary-fill rounded-md inline-flex flex-col justify-start items-start gap-1 overflow-hidden">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="flex-1 justify-start text-dropdown-regular text-xs font-normal font-['Inter'] leading-[18px]">
                    No property users found matching your search.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyUsersCard;
