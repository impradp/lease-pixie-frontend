"use client";

import React, {
  useEffect,
  useContext,
  Suspense,
  useState,
  useCallback,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

import handleToast from "@/lib/utils/toastr";
import { hasRole } from "@/lib/utils/authUtils";
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
  const { isLoading, setLoading } = useContext(LoadingContext);
  const [isReadonly, setIsReadonly] = useState(false);
  const [defaultSearchTerm, setDefaultSearchTerm] = useState("");

  const isSubmitting = useCallback(
    (value: boolean) => setLoading(value),
    [setLoading]
  );
  const globalPortfolioSearch = useCallback(
    (value: string) => setDefaultSearchTerm(value),
    []
  );

  useEffect(() => {
    setIsReadonly(hasRole("READONLYADMINUSER"));
  }, []);

  useEffect(() => {
    handleToast(searchParams);
    router.replace("/dashboard");
  }, [searchParams, router]);

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
            isEditable={!isLoading && !isReadonly}
            existingApprovalData={propertyApprovalData}
            showAdminFunc={true}
          />
          <PropertyAndPortfolioCard
            isEditable={!isLoading && !isReadonly}
            isSubmitting={isSubmitting}
            defaultSearchTerm={defaultSearchTerm}
            showAll={true}
          />
          <PortfolioUsersCard
            isEditable={!isLoading && !isReadonly}
            isSubmitting={isSubmitting}
            defaultSearchTerm={defaultSearchTerm}
            showAll={true}
          />
          <PropertyUsersCard />
          <ROAdminUsersCard
            isEditable={!isLoading && !isReadonly}
            isSubmitting={isSubmitting}
          />
        </div>
        <div className="w-[408px] max-w-full flex justify-center mb-4 custom:mb-0">
          <AccountsCard
            isEditable={!isLoading && !isReadonly}
            isSubmitting={isSubmitting}
            globalPortfolioSearch={globalPortfolioSearch}
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
