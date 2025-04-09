"use client";

import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

import toastr from "@/lib/func/toastr";
import { Account } from "@/types/Account";
import handleError from "@/lib/utils/errorHandler";
import { samplePortfolios } from "@/data/portfolio";
import { sampleProperties } from "@/data/Properties";
import { accountService } from "@/lib/services/account";
import BlankCard from "@/components/dashboard/BlankCard";
import { propertyApprovalData } from "@/data/propertyApproval";
import Breadcrumbs from "@/components/ui/breadcrumbs/Breadcrumbs";
import { LoadingContext } from "@/components/ClientLoadingWrapper";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";
import ROAdminUsersCard from "@/components/dashboard/ROAdminUsersCard";
import AccountsCard from "@/components/dashboard/account/AccountsCard";
import PropertyUsersCard from "@/components/dashboard/property/PropertyUsersCard";
import PortfolioUsersCard from "@/components/dashboard/portfolio/PortfolioUsersCard";
import PropertyApprovalCard from "@/components/dashboard/property/PropertyApprovalCard";
import PropertyAndPortfolioCard from "@/components/dashboard/property/PropertyAndPortfolioCard";

/**
 * Renders the admin dashboard page with cards, filtering, and navigation
 * @returns React.ReactElement - The rendered dashboard page
 */
function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const hasShownSuccessToastr = React.useRef(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const { isLoading, setLoading } = useContext(LoadingContext);

  // Filter accounts based on search term
  const filterAccounts = useCallback(
    (accountsToFilter: Account[], term: string) => {
      return accountsToFilter.filter((company) =>
        [company.companyName, company.contactFirstName, company.email].some(
          (field) => field?.toLowerCase().includes(term.toLowerCase())
        )
      );
    },
    []
  );

  // Update filtered accounts whenever accounts or searchTerm changes
  useEffect(() => {
    setFilteredAccounts(filterAccounts(accounts, searchTerm));
  }, [accounts, searchTerm, filterAccounts]);

  // Fetch accounts for admin
  const fetchAccounts = async () => {
    setLoading(true);
    setSearchTerm(""); // Reset search term on fetch
    try {
      const response = await accountService.fetch();
      if (response.status === "SUCCESS") {
        setAccounts(response?.data);
      } else {
        handleError({ message: "Error fetching accounts." });
      }
    } catch (error) {
      handleError({
        message: "Exception occurred while fetching accounts.",
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // No need to manually filter here as the useEffect will handle it
  };

  // Handle adding a new user (placeholder for future implementation)
  const handleAddUser = () => {
    // TODO: Implement add user logic
  };

  // Filter properties and portfolios directly in render
  const filteredProperties = sampleProperties.filter((property) =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPortfolios = samplePortfolios.filter((portfolio) =>
    portfolio.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show success toast and redirect on initial load if login succeeded
  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "true" && !hasShownSuccessToastr.current) {
      toastr({
        message: "Login successful.",
        toastrType: "success",
      });
      hasShownSuccessToastr.current = true;
      router.replace("/workflows");
    }
  }, [searchParams, router]);

  // Static breadcrumb items defined outside render to avoid recreation
  const breadcrumbItems = [
    { href: "#", label: "Admin Dashboard", isActive: true },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex flex-col custom:flex-row custom:gap-4 mt-4 custom:mt-0 min-h-screen py-4 items-center custom:items-start justify-center relative">
        <div className="w-[408px] max-w-full flex justify-center mb-4 custom:mb-0">
          <BlankCard />
        </div>
        <div className="w-[408px] flex flex-col max-w-full justify-center mb-4 custom:mb-0 gap-4">
          <PropertyApprovalCard
            isEditable={true}
            existingApprovalData={propertyApprovalData}
            showAdminFunc={true}
          />
          <PropertyAndPortfolioCard
            isEditable={true}
            onSearchChange={handleSearchChange}
            portfolios={filteredPortfolios}
            properties={filteredProperties}
          />
          <PortfolioUsersCard />
          <PropertyUsersCard />
          <ROAdminUsersCard onAddUser={handleAddUser} />
        </div>
        <div className="w-[408px] max-w-full flex justify-center mb-4 custom:mb-0">
          <AccountsCard
            accountData={filteredAccounts}
            isEditable={!isLoading}
            onSearchChange={handleSearchChange}
            refreshAccounts={fetchAccounts}
          />
        </div>
      </div>
    </>
  );
}

const DashboardPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <DashboardContent />
    </Suspense>
  );
};

export default DashboardPage;
