//This dashboard is intended for admin user. Please dont use it for other user types.
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { samplePortfolios } from "@/data/portfolio";
import { sampleProperties } from "@/data/Properties";
import Toastr from "@/components/ui/toastrPopup/Toastr";
import BlankCard from "@/components/dashboard/BlankCard";
import { propertyApprovalData } from "@/data/propertyApproval";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";
import { Breadcrumbs } from "@/components/ui/breadcrumbs/Breadcrumbs";
import ROAdminUsersCard from "@/components/dashboard/ROAdminUsersCard";
import PropertyUsersCard from "@/components/dashboard/PropertyUsersCard";
import PortfolioUsersCard from "@/components/dashboard/PortfolioUsersCard";
import PropertyApprovalCard from "@/components/dashboard/PropertyApprovalCard";
import PropertyAndPortfolioCard from "@/components/dashboard/PropertyAndPortfolioCard";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showToastr, setShowToastr] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const hanldeAddUser = () => {
    //TODO: Handle Add User
  };

  const filteredProperties = sampleProperties.filter((property) =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPortfolios = samplePortfolios.filter((portfolio) =>
    portfolio.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "true") {
      setShowToastr(true);
      router.replace("/workflows");
    }
  }, [searchParams, router]);

  const breadcrumbItems = [
    { href: "/portfolio", label: "Add Portfolio" },
    { href: "#", label: "Account Dashboard", isActive: true },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex flex-col custom:flex-row custom:gap-4 mt-4 custom:mt-0 min-h-screen py-4 items-center custom:items-start justify-center relative">
        {showToastr && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 xs:right-4 xs:left-auto xs:translate-x-0 z-50 flex flex-col gap-2">
            <Toastr message="Login successful." toastrType="success" />
          </div>
        )}

        <div className="w-[408px] max-w-full flex justify-center mb-4 custom:mb-0">
          <BlankCard />
        </div>
        <div className="w-[408px] flex flex-col max-w-full flex justify-center mb-4 custom:mb-0 gap-4">
          <PropertyApprovalCard
            isEditable={true}
            existingApprovalData={propertyApprovalData}
          />
          <PropertyAndPortfolioCard
            isEditable={true}
            onSearchChange={handleSearchChange}
            portfolios={filteredPortfolios}
            properties={filteredProperties}
          />
          <PortfolioUsersCard />
          <PropertyUsersCard />
          <ROAdminUsersCard onAddUser={hanldeAddUser} />
        </div>
        <div className="w-[408px] max-w-full flex justify-center mb-4 custom:mb-0">
          <BlankCard />
        </div>
      </div>
    </>
  );
}

const DashboardPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <DashboardContent />;
    </Suspense>
  );
};

export default DashboardPage;
