"use client";

import React, { useState, useEffect } from "react";
import { ArrowDownUpIcon, RotateCcw, Plus, Search } from "lucide-react";

/**
 * Props for the PixieCardHeader component
 */
interface PixieCardHeaderProps {
  onSortIconClick?: () => void; // Callback for sort button click
  onRefreshClick?: () => void; // Callback for refresh button click
  onAddClick?: () => void; // Callback for add button click
  onSearchChange?: (value: string) => void; // Callback for search input changes
  isEditable?: boolean; // Whether the header is interactive (default: false)
  isPlusClicked?: boolean; // Whether the add button is in clicked state (default: false)
  isRefreshClicked?: boolean; // Whether the refresh button is in clicked state (default: false)
  label: string; // Header title
  showSortIcon?: boolean; // Show sort button (default: false)
  showRefreshIcon?: boolean; // Show refresh button (default: false)
  showAddIcon?: boolean; // Show add button (default: false)
  showSearchFeat?: boolean; // Show search input (default: false)
  showSearchIcon?: boolean; // Show search icon in input (default: false)
  globalSearchValue?: string; // Initial value for search input (default: empty string)
}

/**
 * Renders a card header with optional sort, refresh, add, and search features
 * @param props - The properties for configuring the header
 * @returns JSX.Element - The rendered card header
 */
function PixieCardHeader({
  onSortIconClick,
  onRefreshClick,
  onAddClick,
  onSearchChange,
  isEditable = false,
  isPlusClicked = false,
  isRefreshClicked = false,
  label,
  showSortIcon = false,
  showRefreshIcon = false,
  showAddIcon = false,
  showSearchFeat = false,
  showSearchIcon = false,
  globalSearchValue = "",
}: PixieCardHeaderProps) {
  const [searchValue, setSearchValue] = useState(globalSearchValue);

  // Update local search value when globalSearchValue changes
  useEffect(() => {
    setSearchValue(globalSearchValue);
  }, [globalSearchValue]);

  // Handle refresh button click
  const handleRefreshClicked = () => {
    if (isEditable) {
      setSearchValue("");
      onRefreshClick?.();
    }
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange?.(value);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-[15px]">
        <h3 className="text-tertiary-midnightBlue text-[16px] font-semibold font-['Inter']">
          {label}
        </h3>
        <div className="flex items-center gap-[4px]">
          {showSortIcon && (
            <button
              onClick={onSortIconClick}
              className={`w-[40px] h-[35px] flex justify-center items-center rounded-[4px] ${
                isEditable ? "hover:bg-tertiary-blueTint" : "cursor-not-allowed"
              }`}
              disabled={!isEditable}
              aria-label="Sort"
              aria-disabled={!isEditable}
            >
              <ArrowDownUpIcon className="w-[18px] h-[18px] stroke-secondary-button" />
            </button>
          )}
          {showRefreshIcon && (
            <button
              onClick={handleRefreshClicked}
              className={`w-[40px] h-[35px] flex justify-center items-center rounded-[4px] ${
                isRefreshClicked
                  ? "bg-tertiary-darkNavy"
                  : "bg-transparent hover:bg-tertiary-blueTint"
              }`}
              disabled={!isEditable}
              aria-label="Refresh"
              aria-disabled={!isEditable}
            >
              <RotateCcw className="w-[18px] h-[18px] stroke-secondary-button" />
            </button>
          )}
          {showAddIcon && (
            <button
              onClick={onAddClick}
              className={`w-[40px] h-[35px] flex justify-center items-center rounded-[4px] transition-colors ${
                isEditable
                  ? isPlusClicked
                    ? "bg-tertiary-darkNavy"
                    : "bg-transparent hover:bg-tertiary-blueTint"
                  : "cursor-not-allowed bg-transparent"
              }`}
              disabled={!isEditable}
              aria-label="Add"
              aria-disabled={!isEditable}
            >
              <Plus className="w-[20px] h-[20px] stroke-secondary-button" />
            </button>
          )}
        </div>
      </div>
      {showSearchFeat && (
        <div className="w-full mb-2">
          <div className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search"
              className={`w-full px-4 py-2.5 bg-white rounded-lg border border-tertiary-blueTint text-tertiary-light text-[16px] font-normal font-['Inter'] leading-normal outline-none`}
              aria-label="Search"
            />
            {showSearchIcon && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                <Search className="w-[20px] h-[20px] stroke-secondary-button" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PixieCardHeader;
