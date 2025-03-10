"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import WelcomeCard from "@/components/welcome/WelcomeCard";
import WorkflowCard from "@/components/workflows/WorkflowCard";
import { Breadcrumbs } from "@/components/ui/breadcrumbs/Breadcrumbs";

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const workflows = [
    {
      title: "Roof leak at Dominos Pizza Pizza Pizza Pizza",
      workflowTitle:
        "Maintenance (Workflow title here 26 Char limit)fwefwefwefwef",
      date: "06/05",
      estimatedDay: 5,
      unit: "Seattle",
      statusColor: "#C76961",
      circleColor: "#5CA0FF",
      isRead: false, // circleColor is not "#BBBBBB", so isRead is false
    },
    {
      title: "Electrical issue at Walmart Store",
      workflowTitle: "Repairing broken lighting fixtures in the main aisle",
      date: "07/15",
      estimatedDay: 10,
      unit: "Chicago",
      statusColor: "rgb(199 105 97 / 45%)",
      circleColor: "#BBBBBB",
      isRead: true, // circleColor is "#BBBBBB", so isRead is true
    },
    {
      title: "Broken AC at Starbucks Coffee",
      workflowTitle: "Replacing filters and fixing coolant leakage issues",
      date: "05/10",
      estimatedDay: 20,
      unit: "New York",
      statusColor: "#F5D654",
      circleColor: "#BBBBBB",
      isRead: true,
    },
    {
      title: "Plumbing problem at Burger King",
      workflowTitle: "Fixing water leakage in the kitchen sink area",
      date: "08/01",
      estimatedDay: 2,
      unit: "San Francisco",
      statusColor: "rgb(245 214 84 / 45%)",
      circleColor: "#BBBBBB",
      isRead: true,
    },
    {
      title: "Broken window at Apple Store",
      workflowTitle: "Replacing shattered glass panels in the storefront",
      date: "09/21",
      estimatedDay: 3,
      unit: "Los Angeles",
      statusColor: "#2790AC",
      circleColor: "#BBBBBB",
      isRead: true,
    },
    {
      title: "Roof repair at Tesla Showroom",
      workflowTitle: "Patching roof tiles damaged during a recent storm",
      date: "06/12",
      estimatedDay: 15,
      unit: "Austin",
      statusColor: "rgb(39 144 172 / 45%)",
      circleColor: "#BBBBBB",
      isRead: true,
    },
    {
      title: "Water damage at Nike Store",
      workflowTitle: "Drywall replacement and ceiling repairs",
      date: "07/18",
      estimatedDay: 8,
      unit: "Boston",
      statusColor: "rgb(43 204 196)",
      circleColor: "#BBBBBB",
      isRead: true,
    },
    {
      title: "Fire alarm issue at Costco Warehouse",
      workflowTitle: "Testing and replacing faulty fire alarm units",
      date: "10/05",
      estimatedDay: 12,
      unit: "Dallas",
      statusColor: "rgb(43 204 196 / 45%)",
      circleColor: "#BBBBBB",
      isRead: true,
    },
    {
      title: "Parking lot cracks at Target Store",
      workflowTitle: "Fixing surface-level cracks and repainting lines",
      date: "06/22",
      estimatedDay: 6,
      unit: "Miami",
      statusColor: "#CECECE",
      circleColor: "#BBBBBB",
      isRead: true,
    },
    {
      title: "HVAC maintenance at Amazon Fulfillment Center",
      workflowTitle: "Upgrading old units to meet new efficiency standards",
      date: "04/15",
      estimatedDay: 25,
      unit: "Houston",
      statusColor: "rgb(0 0 0)",
      circleColor: "#BBBBBB",
      isRead: true,
    },
  ];

  const filteredWorkflows = workflows.filter((workflow) =>
    workflow.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const user = {
    name: "Jane",
    email: "janedoe@gmail.com",
  };

  const handleSignIn = (authCode?: string) => {
    console.log("Signed in with Auth Code:", authCode);
  };

  const handleSignOut = () => {
    console.log("tesfdfstdftsf");
    router.push("/login");
  };

  const breadcrumbItems = [
    { href: "/account/portfolio", label: "Add Portfolio" },
    { href: "#", label: "Account Dashboard", isActive: true },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex flex-col custom:flex-row custom:gap-4 mt-4 custom:mt-0 min-h-screen py-4 items-center custom:items-start justify-center">
        <div className="w-[400px] max-w-full flex justify-center mb-4 custom:mb-0">
          <WorkflowCard
            workflows={filteredWorkflows}
            isEditable={true}
            onSearchChange={handleSearchChange}
          />
        </div>
        <div className="w-[400px] custom:w-full max-w-full custom:flex-1 flex justify-center">
          <WelcomeCard
            email={user.email}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
            initialAuthCode={["", "", "", "", "", ""]}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
