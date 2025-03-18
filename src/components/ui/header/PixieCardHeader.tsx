"use client";

import React from "react";
import { ArrowDownUpIcon, RotateCcw, Plus, Search } from "lucide-react";

interface PixieCardHeaderProps {
  onSortIconClick?: () => void;
  onRefreshClick?: () => void;
  onAddClick?: () => void;
  onSearchChange?: (value: string) => void;
  isEditable?: boolean;
  isPlusClicked?: boolean;
  isRefreshClicked?: boolean;
  label: string;
  showSortIcon?: boolean;
  showRefreshIcon?: boolean;
  showAddIcon?: boolean;
  showSearchFeat?: boolean;
  showSearchIcon?: boolean;
}

export default function PixieCardHeader({
  onSortIconClick,
  onRefreshClick,
  onAddClick,
  onSearchChange,
  isEditable = false,
  isPlusClicked = false,
  label,
  showAddIcon = false,
  isRefreshClicked = false,
  showRefreshIcon = false,
  showSortIcon = false,
  showSearchFeat = false,
  showSearchIcon = false,
}: PixieCardHeaderProps) {
  const [searchValue, setSearchValue] = React.useState("");

  const handleRefreshClicked = () => {
    onRefreshClick?.();
    setSearchValue("");
  };

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
          {label}
        </h3>
        <div className="flex justify-start items-center gap-[4px]">
          {showSortIcon && (
            <button
              onClick={isEditable ? onSortIconClick : undefined}
              className={`w-[40px] h-[35px] flex justify-center items-center rounded-[4px] ${
                isEditable ? "hover:bg-tertiary-blueTint" : "cursor-not-allowed"
              }`}
              disabled={!isEditable}
            >
              <ArrowDownUpIcon className="w-[18px] h-[18px] stroke-secondary-button" />
            </button>
          )}
          {showRefreshIcon && (
            <button
              onClick={isEditable ? handleRefreshClicked : undefined}
              className={`w-[40px] h-[35px] flex justify-center items-center rounded-[4px] ${
                isEditable
                  ? isRefreshClicked
                    ? "bg-tertiary-darkNavy"
                    : "bg-transparent hover:bg-tertiary-blueTint"
                  : "cursor-not-allowed bg-transparent"
              }`}
              disabled={!isEditable}
            >
              <RotateCcw className="w-[18px] h-[18px] stroke-secondary-button" />
            </button>
          )}
          {showAddIcon && (
            <button
              onClick={isEditable ? onAddClick : undefined}
              className={`w-[40px] h-[35px] flex justify-center items-center rounded-[4px] transition-colors ${
                isEditable
                  ? isPlusClicked
                    ? "bg-tertiary-darkNavy"
                    : "bg-transparent hover:bg-tertiary-blueTint"
                  : "cursor-not-allowed bg-transparent"
              }`}
              disabled={!isEditable}
            >
              <Plus className="w-[20px] h-[20px] stroke-secondary-button" />
            </button>
          )}
        </div>
      </div>

      {showSearchFeat && (
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
            {showSearchIcon && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                <div className="w-5 h-5 relative overflow-hidden">
                  <Search className="w-[20px] h-[20px] stroke-secondary-button" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
