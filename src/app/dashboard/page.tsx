"use client";

import React, { useState, useEffect, useContext, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import toastr from "@/lib/func/toastr";
import { samplePortfolios } from "@/data/portfolio";
import { sampleProperties } from "@/data/Properties";
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
  const { isLoading, setLoading } = useContext(LoadingContext);

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
      router.replace("/dashboard");
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
          <PortfolioUsersCard
            isEditable={!isLoading}
            isSubmitting={(value: boolean) => setLoading(value)}
          />
          <PropertyUsersCard />
          <ROAdminUsersCard onAddUser={handleAddUser} />
        </div>
        <div className="w-[408px] max-w-full flex justify-center mb-4 custom:mb-0">
          <AccountsCard
            isEditable={!isLoading}
            isSubmitting={(value: boolean) => setLoading(value)}
          />
        </div>
      </div>
    </>
  );
}

/**
 * Renders the dashboard page with suspense fallback
 * @returns JSX.Element - The rendered dashboard page
 */
const DashboardPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <DashboardContent />
    </Suspense>
  );
};

export default DashboardPage;
