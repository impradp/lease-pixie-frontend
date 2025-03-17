"use client";

import { useState, useEffect } from "react";
import { ToastrMessage } from "@/types/ToastrMessage";
import Toastr from "@/components/ui/toastrPopup/Toastr";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";
import { Breadcrumbs } from "@/components/ui/breadcrumbs/Breadcrumbs";
import SpaceSettingsCard from "@/components/property/SpaceSettingsCard";
import PropertyInfoCard from "@/components/property/PropertyInfoCard";
import { Locale } from "@/locales";
import { getMessages } from "@/locales/loader";
import InvoiceSettingsCard from "@/components/property/InvoiceSettingsCard";
import BankSettingsCard from "@/components/property/BankSettingsCard";
import { sampleBankAccounts } from "@/data/accounts";
import { WorkflowAutomationSync } from "@/components/property/WorkflowAutomationSync";

export default function PropertyPage() {
  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [toastrs, setToastrs] = useState<ToastrMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const portfolioOptions = [
    {
      label: "Portfolio 1",
      value: "Portfolio 1",
    },
    {
      label: "Portfolio 2",
      value: "Portfolio 2",
    },
    {
      label: "Portfolio 3",
      value: "Portfolio 3",
    },
  ];

  const categoryOptions = [
    {
      label: "Category 1",
      value: "Category 1",
    },
    {
      label: "Category 2",
      value: "Category 2",
    },
    {
      label: "Category 3",
      value: "Category 3",
    },
  ];

  const largestMonthlyInvoiceOptions = [
    { label: "$1000", value: "$1000" },
    { label: "$2000", value: "$2000" },
    { label: "$3000", value: "$3000" },
  ];

  const floorPlanOptions = [
    { label: "Floor Plan 1", value: "Floor Plan 1" },
    { label: "Floor Plan 2", value: "Floor Plan 2" },
    { label: "Floor Plan 3", value: "Floor Plan 3" },
  ];

  const elevatorPlanOptions = [
    { label: "Elevator Plan 1", value: "Elevator Plan 1" },
    { label: "Elevator Plan 2", value: "Elevator Plan 2" },
    { label: "Elevator Plan 3", value: "Elevator Plan 3" },
  ];

  const buildingStructureOptions = [
    { label: "Block", value: "Block" },
    { label: "Brick", value: "Brick" },
    { label: "Concrete", value: "Concrete" },
    { label: "Steel", value: "Steel" },
    { label: "Wood", value: "Wood" },
  ];

  const roofStructureOptions = [
    { label: "Asphalt", value: "Asphalt" },
    { label: "Concrete", value: "Concrete" },
    { label: "Metal", value: "Metal" },
    { label: "Rubber", value: "Rubber" },
    { label: "Shingle", value: "Shingle" },
  ];

  const sprinklerSystemOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  const firePanelsOptions = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
  ];

  const existingPropertyInfoData = {
    portfolioName: "Portfolio 1",
    propertyTitle: "Property 1",
    propertyEntityName: "Property 1",
    physicalPropertyAddress: "",
    requestedBuildingSize: "",
    requestedCategory: "",
    estimatedMonthlyCollection: "",
    largestMonthlyInvoice: "",
    propertyManagementLegalEntity: "",
    propertyManagementOfficePhoneNumber: "",
    payableRemittanceAddress: "",
    floorPlan: "",
    elvatorPlan: "",
    buildingStructure: "",
    roofStructure: "",
    constructionYear: "",
    propertyExpirationDate: "",
    firePanels: "",
    sprinklerSystem: "",
  };

  const existingInvoiceSettingsData = {
    entityForInvoiceHeader: "Invoice Header 1",
    addressForInvoiceHeader: "",
    phoneForInvoiceHeader: "",
    taxRateBaseRentFlag: false,
    taxRateBaseRent: "",
    defaultNoticeBody:
      "This letter confirms a monetary default under your lease.  The details of the outstanding invoices are below, please address these payments immediately.  Further communications will be conducted by our attorney, after which point, incurred attorney costs related to this default shall be added to any amounts due.",
    w9CompletedFile: "",
  };

  const handleEdit = () => {};

  const handleSectionEdit = (section: string) => {
    setEditingSection(section);
  };

  const handleSectionClose = () => {
    setSelectedFile(null);
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
      setSelectedFile(file);
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

  // TODO: Handle file upload
  const handleSpaceSettingUpdate = () => {
    console.log("File uploaded", selectedFile);
  };

  //TODO: Handle
  const handlePropertyInfoUpdate = () => {
    console.log("Property Info Updated");
  };

  const handleBankSettingsUpdate = () => {
    console.log("Bank Settings Updated");
  };

  const handleInvoiceSettingsUpdate = () => {
    console.log("Invoice Settings Updated");
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
