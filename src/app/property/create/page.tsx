"use client";

import { useState, useEffect } from "react";
import { Locale } from "@/locales";
import toastr from "@/lib/func/toastr";
import { getMessages } from "@/locales/locale";
import { sampleStar, sampleSeats } from "@/data/workflowStars";
import { sampleBankAccounts } from "@/data/accounts";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";
import PropertyInfoCard from "@/components/property/PropertyInfoCard";
import BankSettingsCard from "@/components/property/BankSettingsCard";
import { Breadcrumbs } from "@/components/ui/breadcrumbs/Breadcrumbs";
import SpaceSettingsCard from "@/components/property/SpaceSettingsCard";
import InvoiceSettingsCard from "@/components/property/InvoiceSettingsCard";
import { WorkflowAutomationSync } from "@/components/property/WorkflowAutomationSync";
import {
  buildingStructureOptions,
  categoryOptions,
  elevatorPlanOptions,
  existingInvoiceSettingsData,
  existingPropertyInfoData,
  firePanelsOptions,
  floorPlanOptions,
  largestMonthlyInvoiceOptions,
  portfolioOptions,
  roofStructureOptions,
  sprinklerSystemOptions,
} from "@/data/Properties";
import WorkflowStars from "@/components/property/WorkflowStars";
import WorkflowSeats from "@/components/property/WorkflowSeats";
import { sampleVendors } from "@/data/users";

export default function PropertyPage() {
  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleEdit = () => {};

  const handleSectionEdit = (section: string) => {
    setEditingSection(section);
  };

  const handleSectionClose = () => {
    setEditingSection(null);
  };

  const workflowInactivityThresholdOptions = [
    { label: "Select Threshold", value: "" },
    { label: "multiple of 15", value: "-15" },
    { label: "multiple of -10", value: "-10" },
    { label: "multiple of -5", value: "-5" },
    { label: "multiple of 5", value: "5" },
  ];

  const starOptions = {
    maintainenceStars: sampleStar,
    accountingStars: sampleStar,
    leaseStars: sampleStar,
    billPayStars: sampleStar,
    workflowInactivityThresholds: workflowInactivityThresholdOptions,
  };

  const seatOptions = {
    maintenanceSeats: sampleVendors, // Reusing sampleStar; replace with actual seat data if different
    accountingSeats: sampleVendors,
    leaseSeats: sampleVendors,
    billPaySeats: sampleVendors,
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    const validExtensions = [".xls", ".xlsx"];
    const fileExtension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      toastr({
        message: "Invalid file type. Please select an XLS or XLSX file.",
        toastrType: "error",
      });
      return;
    }

    if (file.size <= 10 * 1024 * 1024) {
      // TODO: Set selected file
    } else {
      toastr({
        message: "File size exceeds 10MB limit",
        toastrType: "warning",
      });
    }
  };

  const handleSpaceSettingUpdate = () => {
    // TODO: Handle file upload
  };

  const handlePropertyInfoUpdate = () => {
    // TODO: Handle property update
  };

  const handleBankSettingsUpdate = () => {
    // TODO: Handle bank settings update
  };

  const handleInvoiceSettingsUpdate = () => {
    // TODO: Handle invoice settings update
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const emptyStarOption = sampleStar.find((opt) => opt.value === "");
  const emptySeatOption = sampleSeats.find((opt) => opt.value === "");
  const emptyThresholdOption = workflowInactivityThresholdOptions.find(
    (opt) => opt.value === ""
  );

  const [workflowStarsFormData, setWorkflowStarsFormData] = useState({
    maintainenceStar: emptyStarOption,
    accountingStar: emptyStarOption,
    leaseStar: emptyStarOption,
    billPayStar: emptyStarOption,
    maintainenceStarThreshold: emptyThresholdOption,
    accountingStarThreshold: emptyThresholdOption,
    leaseStarThreshold: emptyThresholdOption,
    billPayStarThreshold: emptyThresholdOption,
  });

  const [workflowSeatsFormData, setWorkflowSeatsFormData] = useState({
    maintenanceSeat: emptySeatOption,
    accountingSeat: emptySeatOption,
    leaseSeat: emptySeatOption,
    billPaySeat: emptySeatOption,
  });

  const breadcrumbItems = [
    { href: "/admin", label: "Admin Dashboard" },
    { href: "#", label: "Add Property", isActive: true },
  ];

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      <div className="max-w-[800px] mx-auto space-y-8 py-4">
        <div className="space-y-8">
          <SpaceSettingsCard
            onEdit={handleEdit}
            sectionId="propertySettingsCard"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
            showInfo={true}
            workingTemplateLink={"www.google.com"}
            instructionalTemplateLink={"www.google.com"}
            downloadInfoContent="Download Property Info: Sample Property Info here."
            uploadInfoContent="Upload Property Info: Sample Property Info here."
            onFileSelect={handleFileSelect}
            handleSpaceSettingUpdate={handleSpaceSettingUpdate}
          />
          <PropertyInfoCard
            onEdit={handleEdit}
            sectionId="propertyInfoCard"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
            handlePropertyInfoUpdate={handlePropertyInfoUpdate}
            portfolioOptions={portfolioOptions}
            existingPropertyInfoData={existingPropertyInfoData}
            largestMonthlyInvoiceOptions={largestMonthlyInvoiceOptions}
            categoryOptions={categoryOptions}
            floorPlanOptions={floorPlanOptions}
            elevatorPlanOptions={elevatorPlanOptions}
            buildingStructureOptions={buildingStructureOptions}
            roofStructureOptions={roofStructureOptions}
            sprinklerSystemOptions={sprinklerSystemOptions}
            firePanelsOptions={firePanelsOptions}
          />
          <InvoiceSettingsCard
            onEdit={handleEdit}
            sectionId="propertySettingsCard"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
            handleInvoiceSettingsCardUpdate={handleInvoiceSettingsUpdate}
            existingInvoiceSettings={existingInvoiceSettingsData}
            showInfo={true}
            infoContent={
              "Invoice Settings: This info is related to invoice settings."
            }
          />
          <BankSettingsCard
            onEdit={handleEdit}
            sectionId="bankSettingsCard"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
            selectedAccount={sampleBankAccounts[3]?.value}
            handleBankSettingsUpdate={handleBankSettingsUpdate}
            defaultBankAccountOptions={sampleBankAccounts}
            pendingAccountApproval={false}
            showInfo={true}
            showInfoContent={
              "Bank Settings: This info is related to bank accounts."
            }
          />
          <WorkflowAutomationSync
            label={messages?.property?.automation?.title}
            title={messages?.property?.automation?.syncTitle}
            info={messages?.property?.automation?.info}
            sectionId="workflowAutomationSync"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
          />
          <WorkflowStars
            label={"Workflow Stars"}
            initialFormData={workflowStarsFormData}
            onFormDataChange={setWorkflowStarsFormData}
            starOptions={starOptions}
            sectionId="workflowStars"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
            subLabels={[
              "Maintainence star",
              "Accounting star",
              "Lease star",
              "Bill-pay star",
            ]}
            showInfo={true}
            infoContents={[
              "Maintainence Star: Sample Info",
              "Accounting Star: Sample Info",
              "Lease Star: Sample Info",
              "Bill Pay Star: Sample Info",
            ]}
          />
          <WorkflowSeats
            label={"Workflow Seats"}
            initialFormData={workflowSeatsFormData}
            onFormDataChange={setWorkflowSeatsFormData}
            seatOptions={seatOptions}
            sectionId="workflowSeats"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
            subLabels={[
              "Tax reporting seat",
              "Insurance seat",
              "Leasing seat (Licensed broker or property owner only)",
              "Attorney seat (Licensed attorney only)",
            ]}
            showInfo={true}
            infoContents={[
              "Tax reporting seat: Sample Info",
              "Insurance seat: Sample Info",
              "Leasing seat (Licensed broker or property owner only): Sample Info",
              "Attorney seat (Licensed attorney only): Sample Info",
            ]}
          />
        </div>
      </div>
    </>
  );
}
