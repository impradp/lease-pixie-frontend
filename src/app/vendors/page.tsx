/**
 * Page component for displaying a list of vendors with editable cards.
 * Fetches vendor data and renders VendorCard components for each vendor.
 * Manages global editing state to ensure only one card is editable at a time.
 * Includes a filter dropdown to filter vendors by status (Active/Inactive) and a search input.
 *
 * @returns JSX.Element - The rendered vendors page
 */
"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { CirclePlus, Search } from "lucide-react";
import handleInfo from "@/lib/utils/errorHandler";
import { NewVendorFormData } from "@/types/vendor";
import { vendorService } from "@/lib/services/vendor";
import VendorCard from "@/components/vendor/VendorCard";
import Breadcrumbs from "@/components/ui/breadcrumbs/Breadcrumbs";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";
import { NewVendor } from "@/components/portfolio/vendor/NewVendor";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { FilterConfig } from "@/types/Filter";

/**
 * Renders the content for the vendors page
 * @returns JSX.Element - The rendered vendors content
 */
const VendorsContent: React.FC = () => {
  const [vendors, setVendors] = useState<NewVendorFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [showNewVendorForm, setShowNewVendorForm] = useState(false);
  // Initialize selectedFilters with default "Active" status
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[] | string | null;
  }>({ Status: "true" });

  // Fetch vendors from the API
  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await vendorService.fetchAll();

      if (response?.status === "SUCCESS") {
        setEditingSection(null);
        setVendors(response.data);
      } else {
        handleInfo({ code: 100806 });
      }
    } catch (err) {
      handleInfo({ code: 100807, error: err });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Handle section edit state
  const handleSectionEdit = (section: string) => {
    setEditingSection(section);
  };

  // Close editing section
  const handleSectionClose = () => {
    setEditingSection(null);
  };

  // Update vendor data
  const handleVendorUpdate = async (
    vendorId: string,
    updatedData: NewVendorFormData
  ) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await vendorService.update(vendorId, updatedData);

      if (response?.status === "SUCCESS") {
        handleInfo({ code: 100803 });
        await fetchVendors();
      } else {
        handleInfo({ code: 100804 });
      }
    } catch (err) {
      handleInfo({ code: 100805, error: err });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles adding a new vendor via API
   * @param userData - Data for the new vendor
   * @param setLoading - Function to toggle loading state
   */
  const handleAddVendor = async (
    userData: NewVendorFormData,
    setLoading: (loading: boolean) => void
  ) => {
    try {
      setShowNewVendorForm(false);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await vendorService.create(userData);
      if (response?.status === "SUCCESS") {
        handleInfo({ code: 100510 });
        await fetchVendors();
      } else {
        handleInfo({ code: 100511 });
      }
    } catch (err) {
      handleInfo({ code: 100512, error: err });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Closes the new vendor modal
   */
  const handleCloseVendorModal = () => {
    setShowNewVendorForm(false);
  };

  // Delete a vendor
  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await vendorService.delete(id);

      if (response?.status === "SUCCESS") {
        handleInfo({ code: 100800 });
        await fetchVendors();
      } else {
        handleInfo({ code: 100801 });
      }
    } catch (err) {
      handleInfo({ code: 100802, error: err });
    } finally {
      setIsLoading(false);
    }
  };

  // Restore a vendor
  const handleRestore = async (id: string) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await vendorService.restore(id);

      if (response?.status === "SUCCESS") {
        handleInfo({ code: 100518 });
        await fetchVendors();
      } else {
        handleInfo({ code: 100519 });
      }
    } catch (err) {
      handleInfo({ code: 100520, error: err });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (filters: {
    [key: string]: string[] | string | null;
  }) => {
    setSelectedFilters(filters);
  };

  // Filter vendors based on search term and status
  const filteredVendors = useMemo(() => {
    handleSectionClose();
    return vendors.filter((vendor) => {
      const matchesSearch = vendor.companyName
        ?.toLowerCase()
        .includes(searchValue.toLowerCase());
      const matchesStatus =
        selectedFilters.Status === null ||
        (selectedFilters.Status === "true" && !vendor.isDeleted) ||
        (selectedFilters.Status === "false" && vendor.isDeleted);
      return matchesSearch && matchesStatus;
    });
  }, [vendors, searchValue, selectedFilters]);

  // Configure the filter for Status
  const filters: FilterConfig[] = [
    {
      filterLabel: "Status",
      filterType: "radio",
      options: [
        { id: "true", name: "Active" },
        { id: "false", name: "Inactive" },
      ],
    },
  ];

  const breadcrumbItems = [
    { href: "/account", label: "Account Dashboard" },
    { href: "#", label: "Vendors", isActive: true },
  ];

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="max-w-[800px] mx-auto space-y-8 py-4">
        <div className="flex flex-col sm:flex-row gap-8 items-center">
          <div className="relative w-[415px]">
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search"
              className="w-full px-4 py-2.5 bg-white rounded-lg border border-tertiary-blueTint text-tertiary-light text-[16px] font-normal font-['Inter'] leading-normal outline-none"
              aria-label="Search"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
              <Search className="w-5 h-5 stroke-secondary-button" />
            </div>
          </div>
          <div className="relative w-[287px]">
            <FilterDropdown
              label="Select Status"
              filters={filters}
              initialFilters={{ Status: "true" }} // Set default to Active
              onFilterChange={handleFilterChange}
            />
          </div>
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full"
            aria-label="Add vendor"
            onClick={() => setShowNewVendorForm(true)}
          >
            <CirclePlus className="w-8 h-8 stroke-white hover:stroke-secondary-button" />
          </button>
        </div>
      </div>
      <div className="max-w-[800px] mx-auto space-y-8 py-4">
        {filteredVendors.map((vendor) => (
          <VendorCard
            key={vendor.id ?? `vendor-${vendor.companyName}`}
            vendorId={vendor.id?.toString() ?? ""}
            defaultData={vendor}
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
            onSubmit={handleVendorUpdate}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
        ))}
        {filteredVendors.length === 0 && (
          <div className="p-4 bg-secondary-fill rounded-md flex justify-center items-center">
            <span className="text-xs text-dropdown-regular font-normal font-['Inter'] leading-[18px]">
              No vendors available matching your search or filter.
            </span>
          </div>
        )}
      </div>
      {showNewVendorForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <NewVendor
            onClose={handleCloseVendorModal}
            onSubmit={handleAddVendor}
          />
        </div>
      )}
    </>
  );
};

/**
 * Renders the vendors page with suspense fallback
 * @returns JSX.Element - The rendered vendors page
 */
const VendorsPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <VendorsContent />
    </Suspense>
  );
};

export default VendorsPage;
