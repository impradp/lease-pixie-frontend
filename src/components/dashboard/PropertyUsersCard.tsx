"use client";

import React, { useState } from "react";
import { samplePropertyUser } from "@/data/propertyUsers";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import PropertyUsersCardContent from "@/components/dashboard/PropertyUsersCardContent";

const PropertyUsersCard: React.FC = () => {
  const [isRefreshClicked, setIsRefreshClicked] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const onSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const filteredPropertyUsers = samplePropertyUser.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onRefreshClick = () => {
    setIsRefreshClicked(true);
    setSearchTerm("");
    setTimeout(() => {
      setIsRefreshClicked(false);
    }, 500);
  };

  const handlePrivilegeClick = () => {
    //TODO: Call actual api to update the access roles for each properties.
  };

  return (
    <div className="relative w-[408px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
      <div className="w-full">
        <PixieCardHeader
          label={"Property Users"}
          isEditable={true}
          onSearchChange={onSearchChange}
          showSearchFeat={true}
          showRefreshIcon={true}
          onRefreshClick={onRefreshClick}
          isRefreshClicked={isRefreshClicked}
          showSearchIcon={true}
        />
      </div>
      <div className="mt-4 gap-2">
        {filteredPropertyUsers.map((user) => (
          <PropertyUsersCardContent
            key={user.id}
            user={user}
            onPrivilegeClick={handlePrivilegeClick}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyUsersCard;
