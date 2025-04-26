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
 * A specialized component that only renders on the client side
 */
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
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
  // Local state for search value
  const [searchValue, setSearchValue] = useState("");

  // Initialize search value when component mounts (client-side only)
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-tertiary-midnightBlue text-base font-semibold font-['Inter']">
          {label}
        </h3>
        <div className="flex items-center gap-1">
          {/* Render static button placeholders during SSR */}
          {showSortIcon && (
            <ClientOnly>
              <button
                onClick={isEditable ? onSortIconClick : undefined}
                className={`w-[40px] h-[35px] flex justify-center items-center rounded-[4px] ${
                  isEditable
                    ? "hover:bg-tertiary-blueTint"
                    : "cursor-not-allowed"
                }`}
                disabled={!isEditable}
                aria-label="Sort"
                aria-disabled={!isEditable}
              >
                <ArrowDownUpIcon className="w-[18px] h-[18px] stroke-secondary-button" />
              </button>
            </ClientOnly>
          )}
          {showRefreshIcon && (
            <ClientOnly>
              <button
                onClick={isEditable ? handleRefreshClicked : undefined}
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
            </ClientOnly>
          )}
          {showAddIcon && (
            <ClientOnly>
              <button
                onClick={isEditable ? onAddClick : undefined}
                className={`w-[40px] h-[35px] flex justify-center items-center rounded-[4px] ${
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
                <Plus className="w-5 h-5 stroke-secondary-button" />
              </button>
            </ClientOnly>
          )}
        </div>
      </div>
      {showSearchFeat && (
        <ClientOnly>
          <div className="w-full mb-2">
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search"
                className="w-full px-4 py-2.5 bg-white rounded-lg border border-tertiary-blueTint text-tertiary-light text-base font-normal font-['Inter'] leading-normal outline-none"
                aria-label="Search"
              />
              {showSearchIcon && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                  <Search className="w-5 h-5 stroke-secondary-button" />
                </div>
              )}
            </div>
          </div>
        </ClientOnly>
      )}
    </div>
  );
}

export default PixieCardHeader;
