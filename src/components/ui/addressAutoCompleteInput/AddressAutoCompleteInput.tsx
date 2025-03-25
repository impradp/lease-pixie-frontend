import React, { useState, useCallback, useRef, useEffect } from "react";
import { debounce } from "lodash";
import { RadarAutocompleteAddress } from "radar-sdk-js/dist/types";

interface RadarAddress {
  formattedAddress: string;
  placeId?: string;
  [key: string]: unknown;
}

interface AddressAutocompleteInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isEditing?: boolean;
  placeholder?: string;
  inputId?: string;
  disabled?: boolean;
  error?: string; // External error from parent, renamed from formError to match CustomInput
}

const AddressAutocompleteInput: React.FC<AddressAutocompleteInputProps> = ({
  label,
  value,
  onChange,
  isEditing = true,
  placeholder = "",
  inputId = "autocomplete-input",
  disabled = false,
  error = "", // External error, defaults to empty string
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<RadarAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null); // Internal errors (e.g., API failures)
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [radarInitialized, setRadarInitialized] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  // Sync query with value prop and reset internal error when value changes
  useEffect(() => {
    setQuery(value);
    if (value.trim() && internalError) {
      setInternalError(null); // Clear internal error if user provides a value
    }
  }, [value]);

  // Initialize Radar
  useEffect(() => {
    const initializeRadar = async () => {
      if (typeof window === "undefined") return;

      try {
        const API_KEY = process.env.NEXT_PUBLIC_RADAR_API_KEY;
        if (!API_KEY) {
          if (!error) setInternalError("Radar API key is missing");
          return;
        }

        const RadarModule = await import("radar-sdk-js");
        const Radar = RadarModule.default;

        Radar.initialize(API_KEY);
        setRadarInitialized(true);
      } catch {
        if (!error)
          setInternalError("Failed to initialize address autocomplete");
      }
    };

    initializeRadar();
  }, [error]); // Include error to respect its precedence

  // Handle click outside to close suggestions
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const debouncedSearch = debounce(async (input: string) => {
    if (!radarInitialized || disabled) {
      if (!error) {
        setInternalError(
          disabled ? null : "Address service is initializing..."
        );
      }
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
      const RadarModule = await import("radar-sdk-js");
      const Radar = RadarModule.default;

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
          addressesWithFormattedAddress.map((address) => {
            const addressAsUnknown = address as unknown;
            return {
              formattedAddress: address.formattedAddress,
              ...(addressAsUnknown as Record<string, unknown>),
            };
          });

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

  const handleSearchChange = useCallback(
    (input: string) => {
      debouncedSearch(input);
    },
    [debouncedSearch]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !isEditing) return;

    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);
    handleSearchChange(newValue);
    setSelectedValue(null);
    if (error && newValue.trim()) {
      setInternalError(null); // Clear internal error when user starts typing and there was an external error
    }
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
    if (error) setInternalError(null); // Clear internal error on selection
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

  // Display error: external (error) takes precedence over internal
  const displayError = error || internalError;

  return (
    <div
      ref={wrapperRef}
      className="flex flex-col gap-1.5 w-full autocomplete-input-wrapper relative"
    >
      <label
        htmlFor={inputId}
        className={`text-card-input-label text-sm font-medium font-['Inter'] leading-tight ${
          disabled ? "opacity-50" : ""
        }`}
      >
        {label}
      </label>
      <div className="autocomplete-input-container">
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
                  <div className="flex flex-col gap-2">
                    <div className="text-dropdown-semibold text-base font-semibold font-['Inter'] leading-normal">
                      {option.label}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {isLoading && !disabled && (
        <span className="autocomplete-loading">Loading...</span>
      )}
      {displayError && !disabled && (
        <span className="autocomplete-error text-red-500 text-sm mt-1">
          {displayError}
        </span>
      )}
    </div>
  );
};

export default AddressAutocompleteInput;
