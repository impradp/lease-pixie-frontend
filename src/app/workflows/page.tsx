"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { loggedInUser } from "@/data/users";
import handleToast from "@/lib/utils/toastr";
import { loginService } from "@/lib/services/login";
import WelcomeCard from "@/components/welcome/WelcomeCard";
import { workflows as WorkflowList } from "@/data/workflows";
import WorkflowCard from "@/components/workflows/WorkflowCard";
import Breadcrumbs from "@/components/ui/breadcrumbs/Breadcrumbs";
import { sanitizeUrl } from "@/lib/utils/browserUtils";

function WorkflowPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

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
    router.push("/login?msg=100303"); // Add query parameter for logout
  };

  useEffect(() => {
    handleToast(searchParams);
    sanitizeUrl("/workflows", searchParams);
  }, [searchParams, router]);

  const breadcrumbItems = [
    { href: "/portfolio", label: "Add Portfolio" },
    { href: "#", label: "Account Dashboard", isActive: true },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex flex-col custom:flex-row custom:gap-4 mt-4 custom:mt-0 min-h-screen py-4 items-center custom:items-start justify-center relative">
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

export default WorkflowPage;
