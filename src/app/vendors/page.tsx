/**
 * Page component for displaying a list of vendors with editable cards.
 * Fetches vendor data and renders VendorCard components for each vendor.
 * Manages global editing state to ensure only one card is editable at a time.
 * @returns JSX.Element - The rendered vendors page
 */
"use client";

import { useState, useEffect, Suspense } from "react";

import { defaultFilter } from "@/data/filter";
import { CirclePlus, Search } from "lucide-react";
import handleInfo from "@/lib/utils/errorHandler";
import { NewVendorFormData } from "@/types/vendor";
import { vendorService } from "@/lib/services/vendor";
import VendorCard from "@/components/vendor/VendorCard";
import Breadcrumbs from "@/components/ui/breadcrumbs/Breadcrumbs";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";
import { PixieDropdown } from "@/components/ui/input/PixieDropdown";
import { NewVendor } from "@/components/portfolio/vendor/NewVendor";

/**
 * Renders the content for the vendors page
 * @returns JSX.Element - The rendered vendors content
 */
function VendorsContent() {
  // TODO: Replace sampleData with [] once APIs for vendors are functional
  const [vendors, setVendors] = useState<NewVendorFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [showNewVendorForm, setShowNewVendorForm] = useState(false);

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

  // Fetch vendors on mount
  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSectionEdit = (section: string) => {
    setEditingSection(section);
  };

  const handleSectionClose = () => {
    setEditingSection(null);
  };

  // Update vendor data after submission
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
        fetchVendors();
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
    // Submits new vendor data and refreshes list
    try {
      setShowNewVendorForm(false);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await vendorService.create(userData);
      if (response?.status === "SUCCESS") {
        handleInfo({ code: 100510 });
        fetchVendors();
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
    // Hides the new vendor modal
    setShowNewVendorForm(false);
  };

  // Delete vendor
  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const response = await vendorService.delete(id);

      if (response?.status === "SUCCESS") {
        handleInfo({ code: 100800 });
        fetchVendors();
      } else {
        handleInfo({ code: 100801 });
      }
    } catch (err) {
      handleInfo({ code: 100802, error: err });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  // Filter vendors based on searchValue
  const filteredVendors = vendors.filter((vendor) =>
    vendor.companyName?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const breadcrumbItems = [
    { href: "/admin", label: "Admin Dashboard" },
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
              <Search className="w-[20px] h-[20px] stroke-secondary-button" />
            </div>
          </div>
          <div className="relative w-[287px]">
            <PixieDropdown
              options={defaultFilter}
              isEditing={true}
              className="w-full"
              containerClassName="w-full"
              type="large"
              labelClassName="hidden"
              showFilterIcon={true}
            />
          </div>
          <div className="relative">
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full"
              aria-label="Add vendor"
              onClick={() => setShowNewVendorForm(true)}
            >
              <CirclePlus className="w-[32px] h-[32px] stroke-white hover:stroke-secondary-button" />
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-[800px] mx-auto space-y-8 py-4">
        {filteredVendors.map((vendor, index) => (
          <VendorCard
            key={index}
            vendorId={vendor?.id?.toString() ?? ""}
            defaultData={vendor}
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
            onSubmit={handleVendorUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {showNewVendorForm && (
        <div className="fixed inset-0 z-50">
          <div className="relative z-50">
            <NewVendor
              onClose={handleCloseVendorModal}
              onSubmit={handleAddVendor}
            />
          </div>
        </div>
      )}
    </>
  );
}

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
