"use client";

import React, { useEffect, Suspense, useState, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Account } from "@/types/Account";
import handleToast from "@/lib/utils/toastr";
import { getDefaultPage } from "@/config/roleAccess";
import { accountService } from "@/lib/services/account";
import PaymentMethod from "@/components/account/PaymentMethod";
import { propertyApprovalData } from "@/data/propertyApproval";
import WorkflowCard from "@/components/workflows/WorkflowCard";
import Breadcrumbs from "@/components/ui/breadcrumbs/Breadcrumbs";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";
import { LoadingContext } from "@/components/ClientLoadingWrapper";
import AccountDetailsCard from "@/components/account/AccountDetails";
import DepositAccountsCard from "@/components/account/DepositAccountCard";
import PropertyApprovalCard from "@/components/dashboard/property/PropertyApprovalCard";

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, setLoading } = useContext(LoadingContext);
  const [selectedAccount, setSelectedAccount] = useState<Account>();

  // Function to fetch account details, reusable for refetching
  const fetchAccountDetails = async (id?: string) => {
    setLoading(true);
    try {
      if (id) {
        const accountDetails = await accountService.fetchById(Number(id));
        if (accountDetails?.status === "SUCCESS") {
          setSelectedAccount(accountDetails?.data);
        } else {
          router.push(getDefaultPage() + "?msg=100101");
        }
      } else {
        const accountDetails = await accountService.fetch();
        if (accountDetails?.status === "SUCCESS") {
          setSelectedAccount(accountDetails?.data[0]);
        } else {
          router.push(getDefaultPage() + "?msg=100101");
        }
      }
    } catch {
      router.push(getDefaultPage() + "?msg=100101");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleToast(searchParams);
    const id = searchParams.get("id") ?? undefined;
    fetchAccountDetails(id);
    // router.push("/account");
  }, [searchParams, router]);

  // useEffect(() => {}, [id]);

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
              isSubmitting={(value: boolean) => setLoading(value)}
              details={selectedAccount}
              onAccountUpdated={() =>
                fetchAccountDetails(selectedAccount?.id?.toString())
              }
            />
          )}
          <PaymentMethod />
        </div>
        <div className="w-[408px] flex flex-col max-w-full flex justify-center mb-4 custom:mb-0 gap-4">
          <PropertyApprovalCard
            isEditable={true}
            existingApprovalData={propertyApprovalData}
            showAdminFunc={false}
            btnLabel="Approve Monthly Billing"
          />
        </div>
        <div className="w-[408px] max-w-full flex justify-center mb-4 custom:mb-0">
          <DepositAccountsCard isEditable={!isLoading} />
        </div>
      </div>
    </>
  );
}

const AccountPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <AccountContent />
    </Suspense>
  );
};

export default AccountPage;
