/**
 * Interface for filter options (ensure this matches FilterDropdown's expectation)
 */
interface FilterOption {
  id: string;
  name: string;
}

/**
 * Interface for filter configuration
 */
export interface FilterConfig {
  filterLabel: string;
  filterType: "checkbox" | "radio";
  options: FilterOption[];
}

/**
 * Interface for filter selections
 */
export interface FilterSelections {
  [key: string]: string[] | string | null;
}
