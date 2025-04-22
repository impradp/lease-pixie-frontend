/**
 * FilterDropdown Component
 *
 * A reusable Next.js component that provides a filter dropdown with a clickable input field
 * displaying selected options and a dropdown menu with customizable filter sections.
 * Each section can use either checkboxes or radio buttons based on the filter type.
 *
 * @param {Object} props - Component props
 * @param {string} props.label - The label displayed in the input field when no options are selected
 * @param {Array} props.filters - Array of filter configurations, each containing options, type, and label
 * @param {Function} props.onFilterChange - Callback function triggered when filter options change
 * @param {Object} [props.initialFilters] - Initial filter selections to set default values
 *
 * @example
 * ```tsx
 * <FilterDropdown
 *   label="Select Filters"
 *   filters={[
 *     {
 *       filterLabel: "Status",
 *       filterType: "radio",
 *       options: [{ id: "true", name: "Active" }, { id: "false", name: "Inactive" }],
 *     },
 *   ]}
 *   initialFilters={{ Status: "true" }}
 *   onFilterChange={(filters) => console.log(filters)}
 * />
 * ```
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import CustomRadio from "./CustomRadio";
import FilterCheckbox from "./FilterCheckbox";
import { FilterConfig, FilterSelections } from "@/types/Filter";
import { ListFilter } from "lucide-react";

/**
 * Props interface for FilterDropdown component
 */
interface FilterDropdownProps {
  label: string;
  filters?: FilterConfig[];
  onFilterChange: (filters: FilterSelections) => void;
  initialFilters?: FilterSelections;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  filters = [],
  onFilterChange,
  initialFilters = {},
}) => {
  // State for dropdown visibility
  const [isOpen, setIsOpen] = useState(false);

  // State for selected filters
  const [selectedFilters, setSelectedFilters] = useState<FilterSelections>({});

  // Ref for dropdown container to handle click outside
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ref to track if filters have been initialized
  const isInitialized = useRef(false);

  // Initialize selected filters based on provided filters and initialFilters
  useEffect(() => {
    if (isInitialized.current) return;

    const newFilters: FilterSelections = {};
    filters.forEach((filter) => {
      // Use initialFilters if provided, otherwise default to first option or empty array
      newFilters[filter.filterLabel] =
        initialFilters[filter.filterLabel] ??
        (filter.filterType === "checkbox" ? [] : filter.options[0]?.id || null);
    });

    setSelectedFilters(newFilters);
    isInitialized.current = true;
  }, [filters, initialFilters]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Notify parent component of filter changes
  useEffect(() => {
    if (isInitialized.current) {
      onFilterChange(selectedFilters);
    }
  }, [selectedFilters, onFilterChange]);

  /**
   * Toggle checkbox selection for a filter
   * @param filterLabel - Label of the filter section
   * @param optionId - ID of the option to toggle
   */
  const toggleCheckbox = (filterLabel: string, optionId: string) => {
    setSelectedFilters((prev) => {
      const current = (prev[filterLabel] as string[]) || [];
      const newSelection = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...prev, [filterLabel]: newSelection };
    });
  };

  /**
   * Set radio button selection for a filter
   * @param filterLabel - Label of the filter section
   * @param optionId - ID of the option to select
   */
  const setRadio = (filterLabel: string, optionId: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterLabel]: optionId,
    }));
  };

  /**
   * Get display text for the input field
   * @returns String representing selected filters
   */
  const getDisplayText = () => {
    const selectedNames: string[] = [];
    filters.forEach((filter) => {
      if (filter.filterType === "checkbox") {
        const selected =
          (selectedFilters[filter.filterLabel] as string[]) || [];
        const names = filter.options
          .filter((opt) => selected.includes(opt.id))
          .map((opt) => opt.name);
        selectedNames.push(...names);
      } else {
        const selected = selectedFilters[filter.filterLabel] as string;
        const name = filter.options.find((opt) => opt.id === selected)?.name;
        if (name) selectedNames.push(name);
      }
    });
    return selectedNames.length > 0 ? selectedNames.join(", ") : label;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Input */}
      <div className="self-stretch inline-flex justify-between items-center">
        <div className="w-[287px] flex justify-start items-start gap-2">
          <div
            className="w-[287px] px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-[#d6d6d6] flex justify-start items-center gap-2 overflow-hidden cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex-1 flex justify-start items-center gap-2">
              <div className="flex-1 justify-start text-neutral-500 text-base font-normal font-['Inter'] leading-normal">
                {getDisplayText()}
              </div>
            </div>
            {/* Filter Icon */}
            <ListFilter className="w-[20px] h-[20px] stroke-secondary-button" />
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && filters.length > 0 && (
        <div className="absolute top-12 w-[287px] bg-white rounded-lg shadow-[0px_4px_6px_-2px_rgba(16,24,40,0.03),0px_12px_16px_-4px_rgba(16,24,40,0.08)] outline outline-1 outline-offset-[-1px] outline-[#eaecf0] flex flex-col justify-start items-start overflow-hidden z-10">
          <div className="w-full py-1 flex flex-col justify-start items-start">
            {filters.map((filter) =>
              filter.options.length > 0 ? (
                <React.Fragment key={filter.filterLabel}>
                  {/* Filter Section Header */}
                  <div className="self-stretch px-1.5 py-0.5 border-b border-[#98a1b2] flex justify-start items-center">
                    <div className="flex-1 pl-2 pr-2.5 py-2.5 bg-[#f8f9fb] rounded-md flex justify-start items-center gap-2">
                      <div className="flex-1 flex justify-start items-center gap-2">
                        <div className="w-[220px] justify-start">
                          <span className="text-[#0f1728] text-base font-bold font-['Inter'] leading-normal">
                            {filter.filterLabel}
                          </span>
                          {filter.filterType === "checkbox" && (
                            <span className="text-[#0f1728] text-sm font-normal font-['Inter'] leading-normal">
                              {" "}
                              view all
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Filter Options */}
                  {filter.options.map((option) => {
                    const isChecked =
                      filter.filterType === "checkbox"
                        ? (
                            (selectedFilters[filter.filterLabel] as string[]) ||
                            []
                          ).includes(option.id)
                        : (selectedFilters[filter.filterLabel] as string) ===
                          option.id;

                    return (
                      <div
                        key={option.id}
                        className={`self-stretch px-1.5 py-0.5 flex justify-start items-center ${
                          isChecked ? "bg-[#f8f9fb]" : ""
                        }`}
                      >
                        <div className="flex-1 pl-2 pr-2.5 py-2.5 rounded-md flex justify-start items-center gap-2">
                          <div className="flex-1 flex justify-start items-center gap-2">
                            {filter.filterType === "checkbox" ? (
                              <FilterCheckbox
                                id={`${filter.filterLabel}-${option.id}`}
                                checked={isChecked}
                                onChange={() =>
                                  toggleCheckbox(filter.filterLabel, option.id)
                                }
                                label={option.name}
                                isEditing={true}
                                labelClassName="text-[#0f1728] text-base font-medium"
                              />
                            ) : (
                              <CustomRadio
                                id={`${filter.filterLabel}-${option.id}`}
                                checked={isChecked}
                                onChange={() =>
                                  setRadio(filter.filterLabel, option.id)
                                }
                                label={option.name}
                                isEditing={true}
                                labelClassName="text-[#0f1728] text-base font-medium"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
