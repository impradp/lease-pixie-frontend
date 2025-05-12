"use client";

import { useState, useEffect, Suspense, useContext, useCallback } from "react";
import { Locale } from "@/locales";
import toastr from "@/lib/func/toastr";
import { getMessages } from "@/locales/locale";
import { sampleBankAccounts } from "@/data/accounts";
import { sampleStar, sampleSeats } from "@/data/workflowStars";
import Breadcrumbs from "@/components/ui/breadcrumbs/Breadcrumbs";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";
import PropertyInfoCard from "@/components/property/PropertyInfoCard";
import BankSettingsCard from "@/components/property/BankSettingsCard";
import SpaceSettingsCard from "@/components/property/SpaceSettingsCard";
import InvoiceSettingsCard from "@/components/property/InvoiceSettingsCard";
import { WorkflowAutomationSync } from "@/components/property/WorkflowAutomationSync";
import {
  categoryOptions,
  elevatorPlanOptions,
  existingInvoiceSettingsData,
  existingPropertyInfoData,
  floorPlanOptions,
} from "@/data/Properties";
import WorkflowStars from "@/components/property/WorkflowStars";
import WorkflowSeats from "@/components/property/WorkflowSeats";
import { sampleVendors } from "@/data/users";
import { LoadingContext } from "@/components/ClientLoadingWrapper";
import { useSearchParams } from "next/navigation";
import handleToast from "@/lib/utils/toastr";
import { hasRole } from "@/lib/utils/authUtils";
import InsuranceCard from "@/components/property/InsuranceCard";
import CreateSettingsCard from "@/components/property/CreateSettingsCard";
import AmortizedExpensesCard from "@/components/property/AmortizedExpensesCard";
import PropertyExpensesCard from "@/components/property/PropertyExpensesCard";
import HVACUnitsCard from "@/components/property/HVACUnits";
import MeteredUtilitiesCard from "@/components/property/MeteredUtilitiesCard";
import MetersCard from "@/components/property/MetersCard";
import AmortizationExpensesCard from "@/components/property/AmortizationExpensesCard";
import CustomCategoriesCard from "@/components/property/CustomCategoriesCard";
import VendorsCard from "@/components/property/VendorsCard";
import RealEstateTaxesCard from "@/components/property/RealEstateTaxesCard";
import ScheduledWorkCard from "@/components/property/ScheduledWorkCard";

/**
 * Renders the content for the property page
 * @returns JSX.Element - The rendered property content
 */
function PropertyContent() {
  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);
  const searchParams = useSearchParams();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const { isLoading, setLoading } = useContext(LoadingContext);
  const [isReadonly, setIsReadonly] = useState(false);

  const isSubmitting = useCallback(
    (value: boolean) => setLoading(value),
    [setLoading]
  );

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
    setIsReadonly(hasRole("READONLYADMINUSER"));
    handleToast(searchParams); // Display toast based on search params
  }, [searchParams]);

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
    { href: "/account", label: "Account Dashboard" },
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
          <CreateSettingsCard
            sectionName="create-settings"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
            isSubmitting={isSubmitting}
            isEditable={!isLoading && !isReadonly}
          />
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
            existingPropertyInfoData={existingPropertyInfoData}
            categoryOptions={categoryOptions}
            floorPlanOptions={floorPlanOptions}
            elevatorPlanOptions={elevatorPlanOptions}
          />
          <InsuranceCard
            sectionName="insurance-card"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
            isSubmitting={isSubmitting}
            isEditable={!isLoading && !isReadonly}
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
              "Invoice Settings: used to certify mail default letter to tenants, the letter will include a list of invoices wth associated amounts that are past due."
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
              "Deposit and Merchant Bank Account:  used for receivables payment processing, tenant pushed ACH payments, and tenant check deposits."
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

          <AmortizedExpensesCard
            sectionName="amortized-expenses-card"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
          />

          <PropertyExpensesCard
            sectionName="property-expenses-card"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
          />

          <HVACUnitsCard
            sectionName="hvac-units-card"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
          />

          <MeteredUtilitiesCard
            sectionName="metered-utilities-card"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
          />

          <MetersCard
            sectionName="meters-card"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
          />

          <AmortizationExpensesCard
            sectionName="amortization-expenses-card"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
          />

          <CustomCategoriesCard
            sectionName="custom-categories-card"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
          />
          <VendorsCard
            sectionName="vendors-card"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
          />

          <RealEstateTaxesCard
            sectionName="real-estate-taxes-card"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
          />

          <ScheduledWorkCard
            sectionName="scheduled-work-card"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
          />
        </div>
      </div>
    </>
  );
}

/**
 * Renders the dashboard page with suspense fallback
 * @returns JSX.Element - The rendered property page
 */
const PropertyPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <PropertyContent />
    </Suspense>
  );
};

export default PropertyPage;
