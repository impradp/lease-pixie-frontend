"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import toastr from "@/lib/func/toastr";
import { propertyApprovalData } from "@/data/propertyApproval";
import WorkflowCard from "@/components/workflows/WorkflowCard";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";
import { Breadcrumbs } from "@/components/ui/breadcrumbs/Breadcrumbs";
import DepositAccountsCard from "@/components/account/DepositAccountCard";
import PropertyApprovalCard from "@/components/dashboard/PropertyApprovalCard";

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasShownSuccessToastr = React.useRef(false);

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

  const breadcrumbItems = [
    { href: "#", label: "Account Dashboard", isActive: true },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex flex-col custom:flex-row custom:gap-4 mt-4 custom:mt-0 min-h-screen py-4 items-center custom:items-start justify-center relative">
        <div className="w-[408px] max-w-full flex justify-center mb-4 custom:mb-0">
          <WorkflowCard />
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
          <DepositAccountsCard />
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
