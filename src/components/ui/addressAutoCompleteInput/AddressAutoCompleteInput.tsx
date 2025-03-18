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
}

export const AddressAutocompleteInput: React.FC<
  AddressAutocompleteInputProps
> = ({
  label,
  value,
  onChange,
  isEditing = true,
  placeholder = "",
  inputId = "autocomplete-input",
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<RadarAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [radarInitialized, setRadarInitialized] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null); // Ref for the wrapper div
  const listboxRef = useRef<HTMLUListElement>(null);

  // Initialize Radar only on the client side
  useEffect(() => {
    const initializeRadar = async () => {
      if (typeof window === "undefined") return;

      try {
        const API_KEY = process.env.NEXT_PUBLIC_RADAR_API_KEY;
        if (!API_KEY) {
          //TODO: Handle error: Radar API key is missing.
          return;
        }

        const RadarModule = await import("radar-sdk-js");
        const Radar = RadarModule.default;

        Radar.initialize(API_KEY);
        setRadarInitialized(true);
      } catch {
        //TODO: Log error properly
        setError("Failed to initialize address autocomplete");
      }
    };

    initializeRadar();
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]); // Close the suggestions list
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const debouncedSearch = debounce(async (input: string) => {
    if (!radarInitialized) {
      setError("Address service is initializing...");
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    if (input.trim().length < 3) {
      setSuggestions([]);
      setError(null);
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
        setError(null);
      } else {
        setSuggestions([]);
        setError("No results found");
      }
    } catch {
      //TODO: Handle error properly:Radar autocomplete error
      setError("Failed to fetch address suggestions");
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
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);
    handleSearchChange(newValue);
    setSelectedValue(null);
  };

  const handleOptionClick = (suggestion: RadarAddress) => {
    const fullAddress = suggestion.formattedAddress;
    setQuery(fullAddress);
    onChange(fullAddress);
    setSuggestions([]); // Close the suggestions after selection
    setSelectedValue(
      suggestion.placeId?.toString() || suggestion.formattedAddress
    );
  };

  const handleOptionKeyDown = (
    e: React.KeyboardEvent<HTMLLIElement>,
    suggestion: RadarAddress
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOptionClick(suggestion);
    }
  };

  const options = suggestions.map((suggestion) => ({
    value: suggestion.placeId?.toString() || suggestion.formattedAddress,
    label: suggestion.formattedAddress,
  }));

  return (
    <div
      ref={wrapperRef} // Attach the ref to the wrapper div
      className="flex flex-col gap-1.5 w-full autocomplete-input-wrapper relative" // Added relative for positioning
    >
      <label
        htmlFor={inputId}
        className="text-card-input-label text-sm font-medium font-['Inter'] leading-tight"
      >
        {label}
      </label>
      <div className="autocomplete-input-container">
        <div className="px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border border-card-input-stroke flex items-center">
          <input
            id={inputId}
            placeholder={placeholder}
            type="text"
            value={query}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className="w-full text-base text-tertiary-light font-normal font-['Inter'] leading-normal outline-none bg-transparent"
          />
        </div>
        {suggestions.length > 0 && (
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
      {isLoading && <span className="autocomplete-loading">Loading...</span>}
      {error && <span className="autocomplete-error">{error}</span>}
    </div>
  );
};
