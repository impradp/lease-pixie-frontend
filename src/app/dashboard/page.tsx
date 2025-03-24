"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { samplePortfolios } from "@/data/portfolio";
import { sampleProperties } from "@/data/Properties";
import { ToastrMessage } from "@/types/ToastrMessage";
import Toastr from "@/components/ui/toastrPopup/Toastr";
import BlankCard from "@/components/dashboard/BlankCard";
import { propertyApprovalData } from "@/data/propertyApproval";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";
import { Breadcrumbs } from "@/components/ui/breadcrumbs/Breadcrumbs";
import ROAdminUsersCard from "@/components/dashboard/ROAdminUsersCard";
import AccountsCard from "@/components/dashboard/accounts/AccountsCard";
import PropertyUsersCard from "@/components/dashboard/PropertyUsersCard";
import PortfolioUsersCard from "@/components/dashboard/PortfolioUsersCard";
import PropertyApprovalCard from "@/components/dashboard/PropertyApprovalCard";
import PropertyAndPortfolioCard from "@/components/dashboard/PropertyAndPortfolioCard";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [toastrs, setToastrs] = useState<ToastrMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const hasShownSuccessToastr = React.useRef(false);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const hanldeAddUser = () => {
    //TODO: Handle Add User
  };

  const handleToastrClose = (id: string) => {
    setToastrs((prev) => prev.filter((toastr) => toastr.id !== id));
  };

  const handleChildToastr = (
    message: string,
    toastrType: ToastrMessage["toastrType"]
  ) => {
    const toastrId = `toastr-${Date.now()}-${Math.random()}`;
    setToastrs((prev) => [...prev, { id: toastrId, message, toastrType }]);
  };

  const filteredProperties = sampleProperties.filter((property) =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPortfolios = samplePortfolios.filter((portfolio) =>
    portfolio.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "true" && !hasShownSuccessToastr.current) {
      const toastrId = `toastr-${Date.now()}-${Math.random()}`;
      setToastrs((prev) => [
        ...prev,
        {
          id: toastrId,
          message: "Login successful.",
          toastrType: "success",
        },
      ]);
      hasShownSuccessToastr.current = true;
      router.replace("/workflows");
    }
  }, [searchParams, router]);

  const breadcrumbItems = [
    { href: "#", label: "Admin Dashboard", isActive: true },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex flex-col custom:flex-row custom:gap-4 mt-4 custom:mt-0 min-h-screen py-4 items-center custom:items-start justify-center relative">
        {toastrs.length > 0 && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 xs:right-4 xs:left-auto xs:translate-x-0 z-50 flex flex-col gap-2">
            {toastrs.map((toastr) => (
              <Toastr
                key={toastr.id}
                message={toastr.message}
                toastrType={toastr.toastrType}
                onClose={() => handleToastrClose(toastr.id)}
              />
            ))}
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
          <AccountsCard
            isEditable={true}
            onSearchChange={handleSearchChange}
            onToastr={handleChildToastr}
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
