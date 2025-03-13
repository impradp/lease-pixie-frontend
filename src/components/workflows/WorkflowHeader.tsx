"use client";

import React from "react";
import { ArrowDownUpIcon, RotateCcw, Plus } from "lucide-react";

interface WorkflowHeaderProps {
  onSortIconClick?: () => void;
  onRefreshClick?: () => void;
  onAddClick?: () => void;
  onSearchChange?: (value: string) => void;
  isEditable?: boolean;
  isPlusClicked?: boolean;
}

export default function WorkflowHeader({
  onSortIconClick,
  onRefreshClick,
  onAddClick,
  onSearchChange,
  isEditable = false,
  isPlusClicked = false,
}: WorkflowHeaderProps) {
  const [searchValue, setSearchValue] = React.useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center mb-[15px]">
        <h3 className="text-tertiary-midnightBlue text-[16px] font-semibold font-['Inter']">
          Workflows
        </h3>
        <div className="flex justify-start items-center gap-[4px]">
          <button
            onClick={isEditable ? onSortIconClick : undefined}
            className={`w-[40px] h-[35px] flex justify-center items-center rounded-[4px] ${
              isEditable ? "hover:bg-tertiary-blueTint" : "cursor-not-allowed"
            }`}
            disabled={!isEditable}
          >
            <ArrowDownUpIcon className="w-[18px] h-[18px] stroke-secondary-button" />
          </button>
          <button
            onClick={isEditable ? onRefreshClick : undefined}
            className={`w-[40px] h-[35px] flex justify-center items-center rounded-[4px] ${
              isEditable ? "hover:bg-tertiary-blueTint" : "cursor-not-allowed"
            }`}
            disabled={!isEditable}
          >
            <RotateCcw className="w-[18px] h-[18px] stroke-secondary-button" />
          </button>
          <button
            onClick={isEditable ? onAddClick : undefined}
            className={`w-[40px] h-[35px] flex justify-center items-center rounded-[4px] transition-colors ${
              isEditable
                ? isPlusClicked
                  ? "bg-[#0003]" // Clicked state
                  : "bg-transparent hover:bg-tertiary-blueTint" // Default + hover
                : "cursor-not-allowed bg-transparent"
            }`}
            disabled={!isEditable}
          >
            <Plus className="w-[20px] h-[20px] stroke-secondary-button" />
          </button>
        </div>
      </div>

      <div className="w-full mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchValue}
            onChange={isEditable ? handleSearchChange : undefined}
            placeholder="Search"
            className={`w-full px-4 py-2.5 bg-white rounded-lg border border-tertiary-blueTint text-tertiary-light text-[16px] font-normal font-['Inter'] leading-normal outline-none ${
              !isEditable ? "cursor-not-allowed" : ""
            }`}
            disabled={!isEditable}
          />
        </div>
      </div>
    </div>
  );
}
