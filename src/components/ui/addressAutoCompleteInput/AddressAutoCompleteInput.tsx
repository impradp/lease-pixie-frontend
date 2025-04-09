import React, { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import { RadarAddress } from "@/types/RadarAutoComplete";
import { RadarAutocompleteAddress } from "radar-sdk-js/dist/types";

/**
 * Props for the AddressAutocompleteInput component
 */
interface AddressAutocompleteInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isEditing?: boolean;
  placeholder?: string;
  inputId?: string;
  disabled?: boolean;
  error?: string;
  isRequired?: boolean;
}

/**
 * Renders an autocomplete input for addresses using Radar SDK
 * @param props - The properties for configuring the input
 * @returns JSX.Element - The rendered autocomplete input
 */
const AddressAutocompleteInput: React.FC<AddressAutocompleteInputProps> = ({
  label,
  value,
  onChange,
  isEditing = true,
  placeholder = "",
  inputId = "autocomplete-input",
  disabled = false,
  error = "",
  isRequired = false,
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<RadarAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [radarInitialized, setRadarInitialized] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setQuery(value);
    if (value.trim() && internalError) setInternalError(null);
  }, [value]);

  useEffect(() => {
    const initializeRadar = async () => {
      if (typeof window === "undefined") return;

      try {
        const API_KEY = process.env.NEXT_PUBLIC_RADAR_API_KEY;
        if (!API_KEY) {
          if (!error) setInternalError("Radar API key is missing");
          return;
        }

        const { default: Radar } = await import("radar-sdk-js");
        Radar.initialize(API_KEY);
        setRadarInitialized(true);
      } catch {
        if (!error)
          setInternalError("Failed to initialize address autocomplete");
      }
    };

    initializeRadar();
  }, [error]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const debouncedSearch = debounce(async (input: string) => {
    if (!radarInitialized || disabled) {
      if (!error)
        setInternalError(
          disabled ? null : "Address service is initializing..."
        );
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    if (input.trim().length < 3) {
      setSuggestions([]);
      if (!error) setInternalError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const { default: Radar } = await import("radar-sdk-js");
      const response = await Radar.autocomplete({
        query: input,
        limit: 5,
        countryCode: "US",
      });

      if (response?.addresses?.length > 0) {
        const addressesWithFormattedAddress = response.addresses.filter(
          (
            address
          ): address is RadarAutocompleteAddress & {
            formattedAddress: string;
          } => typeof address.formattedAddress === "string"
        );

        const addressSuggestions: RadarAddress[] =
          addressesWithFormattedAddress.map((address) => ({
            formattedAddress: address.formattedAddress,
            ...(address as unknown as Record<string, unknown>),
          }));

        setSuggestions(addressSuggestions);
        if (!error) setInternalError(null);
      } else {
        setSuggestions([]);
        if (!error) setInternalError("No results found");
      }
    } catch {
      if (!error) setInternalError("Failed to fetch address suggestions");
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !isEditing) return;

    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);
    debouncedSearch(newValue);
    setSelectedValue(null);
    if (error && newValue.trim()) setInternalError(null);
  };

  const handleOptionClick = (suggestion: RadarAddress) => {
    if (disabled) return;

    const fullAddress = suggestion.formattedAddress;
    setQuery(fullAddress);
    onChange(fullAddress);
    setSuggestions([]);
    setSelectedValue(
      suggestion.placeId?.toString() || suggestion.formattedAddress
    );
    if (error) setInternalError(null);
  };

  const handleOptionKeyDown = (
    e: React.KeyboardEvent<HTMLLIElement>,
    suggestion: RadarAddress
  ) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOptionClick(suggestion);
    }
  };

  const options = suggestions.map((suggestion) => ({
    value: suggestion.placeId?.toString() || suggestion.formattedAddress,
    label: suggestion.formattedAddress,
  }));

  const displayError = error || internalError;

  return (
    <div ref={wrapperRef} className="flex flex-col gap-1.5 w-full relative">
      <label
        htmlFor={inputId}
        className={`text-card-input-label text-sm font-medium font-['Inter'] leading-tight ${
          disabled ? "opacity-50" : ""
        }`}
      >
        {label}
        {isRequired && (
          <span className="text-tertiary-muteBlueGray text-sm"> *</span>
        )}
      </label>
      <div className="relative">
        <div
          className={`px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border border-card-input-stroke flex items-center ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <input
            id={inputId}
            placeholder={placeholder}
            type="text"
            value={query}
            onChange={handleInputChange}
            readOnly={!isEditing}
            disabled={disabled}
            className={`w-full text-base text-tertiary-light font-normal font-['Inter'] leading-normal outline-none bg-transparent ${
              disabled ? "cursor-not-allowed" : ""
            }`}
          />
        </div>
        {suggestions.length > 0 && !disabled && (
          <ul
            id={`${inputId}-options`}
            role="listbox"
            ref={listboxRef}
            tabIndex={-1}
            aria-labelledby={inputId}
            aria-activedescendant={
              selectedValue ? `option-${selectedValue}` : undefined
            }
            className="absolute z-10 w-full mt-1 bg-dropdown-fill rounded-lg shadow-lg border border-dropdown-stroke max-h-60 overflow-auto p-0 m-0 list-none"
          >
            {options.map((option, index) => {
              const isSelected = option.value === selectedValue;
              const isLast = index === options.length - 1;
              return (
                <li
                  id={`option-${option.value}`}
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() =>
                    handleOptionClick(
                      suggestions.find(
                        (s) =>
                          (s.placeId?.toString() || s.formattedAddress) ===
                          option.value
                      )!
                    )
                  }
                  onKeyDown={(e) =>
                    handleOptionKeyDown(
                      e,
                      suggestions.find(
                        (s) =>
                          (s.placeId?.toString() || s.formattedAddress) ===
                          option.value
                      )!
                    )
                  }
                  tabIndex={0}
                  className={`px-4 py-3 hover:bg-dropdown-selected cursor-pointer ${
                    isSelected ? "bg-dropdown-selected font-medium" : ""
                  } ${!isLast ? "border-b border-dropdown-stroke" : ""}`}
                >
                  <div className="text-dropdown-semibold text-base font-semibold font-['Inter'] leading-normal">
                    {option.label}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {isLoading && !disabled && (
        <span className="text-sm text-gray-500 mt-1">Loading...</span>
      )}
      {displayError && !disabled && (
        <span className="text-red-500 text-sm mt-1">{displayError}</span>
      )}
    </div>
  );
};

export default AddressAutocompleteInput;
