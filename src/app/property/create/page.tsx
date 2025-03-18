"use client";

import { useState, useEffect } from "react";

import { Locale } from "@/locales";
import { getMessages } from "@/locales/loader";
import { sampleBankAccounts } from "@/data/accounts";
import { ToastrMessage } from "@/types/ToastrMessage";
import Toastr from "@/components/ui/toastrPopup/Toastr";
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

export default function PropertyPage() {
  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [toastrs, setToastrs] = useState<ToastrMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleEdit = () => {};

  const handleSectionEdit = (section: string) => {
    setEditingSection(section);
  };

  const handleSectionClose = () => {
    //TODO: Set selected file
    setEditingSection(null);
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    const validExtensions = [".xls", ".xlsx"];
    const fileExtension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      const toastrId = `toastr-${Date.now()}-${Math.random()}`;
      setToastrs((prev) => [
        ...prev,
        {
          id: toastrId,
          message: "Invalid file type. Please select an XLS or XLSX file.",
          toastrType: "warning",
        },
      ]);
      return;
    }

    // Validate file size
    if (file.size <= 10 * 1024 * 1024) {
      //TODO: Set selected file
    } else {
      const toastrId = `toastr-${Date.now()}-${Math.random()}`;
      setToastrs((prev) => [
        ...prev,
        {
          id: toastrId,
          message: "File size exceeds 10MB limit",
          toastrType: "warning",
        },
      ]);
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

  const handleToastrClose = (id: string) => {
    setToastrs((prev) => prev.filter((toastr) => toastr.id !== id));
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

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
        </div>
      </div>
    </>
  );
}
