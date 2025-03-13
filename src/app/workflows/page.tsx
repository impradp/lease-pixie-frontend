"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { loggedInUser } from "@/data/users";
import { loginService } from "@/lib/services/login";
import Toastr from "@/components/ui/toastrPopup/Toastr";
import WelcomeCard from "@/components/welcome/WelcomeCard";
import { workflows as WorkflowList } from "@/data/workflows";
import WorkflowCard from "@/components/workflows/WorkflowCard";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";
import { Breadcrumbs } from "@/components/ui/breadcrumbs/Breadcrumbs";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [showToastr, setShowToastr] = useState(false);

  const workflows = WorkflowList;

  const filteredWorkflows = workflows.filter((workflow) =>
    workflow.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const user = loggedInUser;

  const handleSignOut = () => {
    loginService.logout();
    router.push("/login?loggedOut=true"); // Add query parameter for logout
  };

  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "true") {
      console.log("Showing toastr at", Date.now());
      setShowToastr(true);
      router.replace("/workflows");
    }
  }, [searchParams, router]);

  const breadcrumbItems = [
    { href: "/account/portfolio", label: "Add Portfolio" },
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
          <WorkflowCard
            workflows={filteredWorkflows}
            isEditable={true}
            onSearchChange={handleSearchChange}
          />
        </div>
        <div className="w-[408px] custom:w-full max-w-full custom:flex-1 flex justify-center">
          <WelcomeCard email={user.email} onSignOut={handleSignOut} />
        </div>
      </div>
    </>
  );
}

const DashboardPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingOverlay size={40} />}>
      <DashboardContent />;
    </Suspense>
  );
};

export default DashboardPage;
