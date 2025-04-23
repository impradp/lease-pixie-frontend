"use client";

import React, { useEffect, Suspense, useState, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Account } from "@/types/Account";
import handleToast from "@/lib/utils/toastr";
import { hasRole } from "@/lib/utils/authUtils";
import { getDefaultPage } from "@/config/roleAccess";
import { accountService } from "@/lib/services/account";
import { propertyApprovalData } from "@/data/propertyApproval";
import WorkflowCard from "@/components/workflows/WorkflowCard";
import PaymentMethod from "@/components/account/PaymentMethod";
import Breadcrumbs from "@/components/ui/breadcrumbs/Breadcrumbs";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";
import { LoadingContext } from "@/components/ClientLoadingWrapper";
import AccountDetailsCard from "@/components/account/AccountDetails";
import DepositAccountsCard from "@/components/account/DepositAccountCard";
import PortfolioUsersCard from "@/components/dashboard/portfolio/PortfolioUsersCard";
import PropertyApprovalCard from "@/components/dashboard/property/PropertyApprovalCard";
import PropertyAndPortfolioCard from "@/components/dashboard/property/PropertyAndPortfolioCard";

/**
 * AccountContent component renders the main content of the account page, including account details,
 * payment methods, property approval, and deposit accounts.
 */
function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, setLoading } = useContext(LoadingContext);
  const [selectedAccount, setSelectedAccount] = useState<Account>();
  const [isReadonly, setIsReadonly] = useState(false);

  /**
   * Fetches account details based on provided ID or retrieves the default account.
   * Handles loading state and error redirection.
   * @param id - Optional account ID to fetch specific account details
   */
  const fetchAccountDetails = async (id?: string) => {
    setLoading(true); // Set loading state to true
    try {
      if (id) {
        const accountDetails = await accountService.fetchById(Number(id));
        if (accountDetails?.status === "SUCCESS") {
          setSelectedAccount(accountDetails?.data); // Update state with fetched account
          router.replace("/account?id=" + id);
        } else {
          router.push(getDefaultPage() + "?msg=100101"); // Redirect on failure
        }
      } else {
        const accountDetails = await accountService.fetch();
        if (accountDetails?.status === "SUCCESS") {
          setSelectedAccount(accountDetails?.data[0]); // Set first account as default
          router.replace("/account");
        } else {
          router.push(getDefaultPage() + "?msg=100101"); // Redirect on failure
        }
      }
    } catch {
      router.push(getDefaultPage() + "?msg=100101"); // Redirect on error
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Effect to handle toast notifications and fetch account details on mount or search param change
  useEffect(() => {
    if (hasRole("READONLYADMINUSER")) {
      setIsReadonly(true);
    } else {
      setIsReadonly(false);
    }
    handleToast(searchParams); // Display toast based on search params
    const id = searchParams.get("id") ?? undefined;
    fetchAccountDetails(id); // Fetch account details
  }, [searchParams, router]);

  // Breadcrumb navigation items
  const breadcrumbItems = [
    { href: "#", label: "Account Dashboard", isActive: true },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex flex-col custom:flex-row custom:gap-4 mt-4 custom:mt-0 min-h-screen py-4 items-center custom:items-start justify-center relative">
        <div className="w-[408px] flex flex-col max-w-full justify-center mb-4 custom:mb-0 gap-4">
          <WorkflowCard />
          {selectedAccount && (
            <AccountDetailsCard
              isEditable={!isLoading && !isReadonly}
              isSubmitting={(value: boolean) => setLoading(value)} // Update loading state on submission
              details={selectedAccount}
              onAccountUpdated={
                () => fetchAccountDetails(selectedAccount?.id?.toString()) // Refetch account on update
              }
            />
          )}
          <PaymentMethod />
        </div>
        <div className="w-[408px] flex flex-col max-w-full flex justify-center mb-4 custom:mb-0 gap-4">
          <PropertyApprovalCard
            isEditable={!isLoading && !isReadonly}
            existingApprovalData={propertyApprovalData}
            showAdminFunc={false}
            btnLabel="Approve Monthly Billing"
          />
          <PropertyAndPortfolioCard
            isEditable={!isLoading && !isReadonly}
            isSubmitting={(value: boolean) => setLoading(value)}
          />
        </div>
        <div className="w-[408px] flex flex-col max-w-full flex justify-center mb-4 custom:mb-0 gap-4">
          <DepositAccountsCard
            isEditable={!isLoading && !isReadonly}
            isSubmitting={(value: boolean) => setLoading(value)}
          />
          <PortfolioUsersCard
            isEditable={!isLoading && !isReadonly}
            isSubmitting={(value: boolean) => setLoading(value)}
          />
        </div>
      </div>
    </>
  );
}

/**
 * AccountPage is the main page component that wraps AccountContent with Suspense for lazy loading.
 * @returns JSX.Element
 */
const AccountPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <AccountContent />
    </Suspense>
  );
};

export default AccountPage;
