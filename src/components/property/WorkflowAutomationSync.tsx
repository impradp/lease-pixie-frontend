"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { RefreshCcw } from "lucide-react";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { ToggleSwitch } from "@/components/ui/input/ToggleSwitch";
import LinkButton from "@/components/ui/buttons/LinkButton";
import { PixieDropdown } from "@/components/ui/input/PixieDropdown";
import { SectionHeader } from "@/components/ui/header/SectionHeader";
import { ClientThemeWrapper } from "@/components/ui/ClientThemeWrapper";

const PixieMonthPicker = dynamic(
  () => import("@/components/ui/datePicker/PixieMonthPicker"),
  {
    ssr: false,
    loading: () => <p>Loading month picker...</p>,
  }
);

interface WorkflowAutomationSyncProps {
  sectionId: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
  label?: string;
  title?: string;
  info?: string;
}

interface FormData {
  syncAutomation: boolean;
  invoiceCreation: boolean;
  invoiceCreationValue: string;
  invoiceEmail: boolean;
  invoiceEmailValue: string;
  invoicePaperMail: boolean;
  invoicePaperMailValue: string;
  invoiceReminderEmail: boolean;
  invoiceReminderEmailValue: string;
  invoiceDefaultNoticeMail: boolean;
  invoiceDefaultNoticeMailValue: string;
  operatingExpenseProcessing: boolean;
  operatingExpenseProcessingValue: string;
  realEstateTaxRequests: boolean;
  realEstateTaxRequestsValue: string;
  propertyInsuranceRenewal: boolean;
  propertyInsuranceRenewalValue: string;
  tenantInsuranceCertificates: boolean;
  tenantInsuranceCertificatesValue: string;
  tenantHVACMaintenance: boolean;
  tenantPestControl: boolean;
  restaurantHoodInspection: boolean;
  tenantSalesReporting: boolean;
  tenantSatisfactionSurvey: boolean;
  vendorW9Request: boolean;
  scheduledMaintenance: boolean;
  meterReadings: boolean;
  meterReadingsValue: string;
  maintenanceWorkApprovals: boolean;
  maintenanceWorkApprovalsPropertyGroupValue: string;
  maintenanceWorkApprovalsPortfolioUserValue: string;
  vendor1099Processing: boolean;
  vendor1099ProcessingValue: string;
}

export const WorkflowAutomationSync: React.FC<WorkflowAutomationSyncProps> = ({
  sectionId,
  editingSection,
  onSectionEdit,
  onSectionClose,
  label,
  title,
  info,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const initialFormData: FormData = {
    syncAutomation: false,
    invoiceCreation: false,
    invoiceCreationValue: "-15",
    invoiceEmail: false,
    invoiceEmailValue: "13",
    invoicePaperMail: false,
    invoicePaperMailValue: "23",
    invoiceReminderEmail: false,
    invoiceReminderEmailValue: "30",
    invoiceDefaultNoticeMail: false,
    invoiceDefaultNoticeMailValue: "30/45/60/90",
    operatingExpenseProcessing: false,
    operatingExpenseProcessingValue: "January 7",
    realEstateTaxRequests: false,
    realEstateTaxRequestsValue: "Select",
    propertyInsuranceRenewal: false,
    propertyInsuranceRenewalValue: "40",
    tenantInsuranceCertificates: false,
    tenantInsuranceCertificatesValue: "20",
    tenantHVACMaintenance: false,
    tenantPestControl: false,
    restaurantHoodInspection: false,
    tenantSalesReporting: false,
    tenantSatisfactionSurvey: false,
    vendorW9Request: false,
    scheduledMaintenance: false,
    meterReadings: false,
    meterReadingsValue: "Select",
    maintenanceWorkApprovals: false,
    maintenanceWorkApprovalsPropertyGroupValue: "$500",
    maintenanceWorkApprovalsPortfolioUserValue: "$5,000",
    vendor1099Processing: false,
    vendor1099ProcessingValue: "January 7",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [tempFormData, setTempFormData] = useState<FormData>(initialFormData);

  const invoiceCreationOptions = [
    { label: "15", value: "-15" },
    { label: "-10", value: "-10" },
    { label: "-5", value: "-5" },
    { label: "5", value: "5" },
  ];
  const invoiceEmailOptions = [
    { label: "13", value: "13" },
    { label: "15", value: "15" },
    { label: "20", value: "20" },
    { label: "25", value: "25" },
  ];
  const invoicePaperMailOptions = [
    { label: "23", value: "23" },
    { label: "25", value: "25" },
    { label: "30", value: "30" },
    { label: "35", value: "35" },
  ];
  const invoiceReminderEmailOptions = [
    { label: "30", value: "30" },
    { label: "35", value: "35" },
    { label: "40", value: "40" },
    { label: "45", value: "45" },
  ];
  const invoiceDefaultNoticeMailOptions = [
    { label: "30", value: "40" },
    { label: "45", value: "45" },
    { label: "60", value: "60" },
    { label: "90", value: "90" },
  ];
  const realEstateTaxRequestsOptions = [
    { label: "5", value: "5" },
    { label: "10", value: "10" },
    { label: "15", value: "15" },
  ];
  const propertyInsuranceRenewalOptions = [
    { label: "40", value: "40" },
    { label: "50", value: "50" },
    { label: "60", value: "60" },
    { label: "70", value: "70" },
  ];
  const tenantInsuranceCertificatesOptions = [
    { label: "20", value: "20" },
    { label: "25", value: "25" },
    { label: "30", value: "30" },
    { label: "35", value: "35" },
  ];
  const meterReadingsOptions = [
    { label: "5", value: "5" },
    { label: "10", value: "10" },
    { label: "15", value: "15" },
    { label: "20", value: "20" },
  ];
  const maintenanceWorkApprovalsPropertyGroupOptions = [
    { label: "$500", value: "$500" },
    { label: "$1,000", value: "$1,000" },
    { label: "$2,000", value: "$2,000" },
    { label: "$5,000", value: "$5,000" },
  ];
  const maintenanceWorkApprovalsPortfolioUserOptions = [
    { label: "$5,000", value: "$5,000" },
    { label: "$10,000", value: "$10,000" },
    { label: "$15,000", value: "$15,000" },
    { label: "$20,000", value: "$20,000" },
  ];

  useEffect(() => {
    if (isEditing) {
      setTempFormData({ ...formData });
    }
  }, [isEditing, formData]);

  const handleEdit = () => {
    if (editingSection === null || editingSection === sectionId) {
      setIsEditing(true);
      onSectionEdit(sectionId);
    }
  };

  const handleCancel = () => {
    setTempFormData({ ...formData });
    setIsEditing(false);
    onSectionClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({ ...tempFormData });
    setIsEditing(false);
    onSectionClose();
  };

  const handleToggle = (field: keyof FormData) => () => {
    if (isEditing) {
      setTempFormData((prev) => ({
        ...prev,
        [field]: !prev[field],
      }));
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 5000);
    }
  };

  const isEditDisabled =
    editingSection !== null && editingSection !== sectionId;

  return (
    <ClientThemeWrapper>
      <div
        className={`p-6 bg-tertiary-fill rounded-xl flex flex-col gap-4 ${
          isEditing ? "bg-card-open-fill" : "bg-card-close-fill"
        }`}
      >
        <SectionHeader
          title={label ?? ""}
          onEdit={handleEdit}
          onTextCancel={handleCancel}
          showEditButton={!isEditing}
          showTextCloseButton={isEditing}
          editDisabled={isEditDisabled}
          showInfo={true}
          infoContent={info ?? ""}
        />

        <div className="flex flex-col xs:flex-row xs:items-center gap-4 xs:gap-[50px]">
          <div className="flex items-center gap-3">
            <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
              {"Off"}
            </span>
            <ToggleSwitch
              isOn={
                isEditing
                  ? tempFormData.syncAutomation
                  : formData.syncAutomation
              }
              onToggle={handleToggle("syncAutomation")}
              isDisabled={!isEditing}
              className="w-9"
            />
            <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
              {title ?? ""}
            </span>
          </div>
        </div>

        {isEditing && tempFormData.syncAutomation && (
          <>
            <div className="flex flex-col gap-1.5 p-1 rounded">
              <div className="flex items-center gap-1 h-[32px] justify-center bg-secondary-fill">
                <RefreshCcw
                  width={16}
                  height={22}
                  className={`stroke-secondary-icon ${
                    isAnimating ? "animate-spin-5s" : ""
                  }`}
                />
                <span className="text-neutral-500 text-xs font-normal font-['Inter'] leading-[18px]">
                  Currently pushing automation settings to all properties
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 text-xs font-normal font-['Inter'] leading-[18px]">
                  Last sync
                </span>
                <span className="text-neutral-500 text-xs font-normal font-['Inter'] leading-[18px]">
                  {new Date().toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </span>
              </div>
            </div>

            <form
              id="portfolio-automation-card"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
                <div className="flex items-center gap-3">
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    {"Off"}
                  </span>
                  <ToggleSwitch
                    isOn={tempFormData.invoiceCreation}
                    onToggle={handleToggle("invoiceCreation")}
                    isDisabled={!isEditing}
                    className="w-9"
                  />
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Invoice creation
                  </span>
                </div>
                <div className="w-full xs:w-auto">
                  <PixieDropdown
                    label="Days relative to 1st of month"
                    options={invoiceCreationOptions}
                    value={tempFormData.invoiceCreationValue}
                    onChange={(value) =>
                      setTempFormData((prev) => ({
                        ...prev,
                        invoiceCreationValue: value,
                      }))
                    }
                    isEditing={isEditing}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
                <div className="flex items-center gap-3">
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    {"Off"}
                  </span>
                  <ToggleSwitch
                    isOn={tempFormData.invoiceEmail}
                    onToggle={handleToggle("invoiceEmail")}
                    isDisabled={!isEditing}
                    className="w-9"
                  />
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Invoice e-mail
                  </span>
                </div>
                <div className="w-full xs:w-auto">
                  <PixieDropdown
                    label="Days following creation"
                    options={invoiceEmailOptions}
                    value={tempFormData.invoiceEmailValue}
                    onChange={(value) =>
                      setTempFormData((prev) => ({
                        ...prev,
                        invoiceEmailValue: value,
                      }))
                    }
                    isEditing={isEditing}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
                <div className="flex items-center gap-3">
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    {"Off"}
                  </span>
                  <ToggleSwitch
                    isOn={tempFormData.invoicePaperMail}
                    onToggle={handleToggle("invoicePaperMail")}
                    isDisabled={!isEditing}
                    className="w-9"
                  />
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Invoice paper mail
                  </span>
                </div>
                <div className="w-full xs:w-auto">
                  <PixieDropdown
                    label="Days following creation"
                    options={invoicePaperMailOptions}
                    value={tempFormData.invoicePaperMailValue}
                    onChange={(value) =>
                      setTempFormData((prev) => ({
                        ...prev,
                        invoicePaperMailValue: value,
                      }))
                    }
                    isEditing={isEditing}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
                <div className="flex items-center gap-3">
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    {"Off"}
                  </span>
                  <ToggleSwitch
                    isOn={tempFormData.invoiceReminderEmail}
                    onToggle={handleToggle("invoiceReminderEmail")}
                    isDisabled={!isEditing}
                    className="w-9"
                  />
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Invoice reminder e-mail
                  </span>
                </div>
                <div className="w-full xs:w-auto">
                  <PixieDropdown
                    label="Days following creation"
                    options={invoiceReminderEmailOptions}
                    value={tempFormData.invoiceReminderEmailValue}
                    onChange={(value) =>
                      setTempFormData((prev) => ({
                        ...prev,
                        invoiceReminderEmailValue: value,
                      }))
                    }
                    isEditing={isEditing}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
                <div className="flex items-center gap-3">
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    {"Off"}
                  </span>
                  <ToggleSwitch
                    isOn={tempFormData.invoiceDefaultNoticeMail}
                    onToggle={handleToggle("invoiceDefaultNoticeMail")}
                    isDisabled={!isEditing}
                    className="w-9"
                  />
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Invoice default notice mail
                  </span>
                </div>
                <div className="w-full xs:w-auto">
                  <PixieDropdown
                    label="Days following due date"
                    options={invoiceDefaultNoticeMailOptions}
                    value={tempFormData.invoiceDefaultNoticeMailValue}
                    onChange={(value) =>
                      setTempFormData((prev) => ({
                        ...prev,
                        invoiceDefaultNoticeMailValue: value,
                      }))
                    }
                    isEditing={isEditing}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
                <div className="flex items-center gap-3">
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    {"Off"}
                  </span>
                  <ToggleSwitch
                    isOn={tempFormData.operatingExpenseProcessing}
                    onToggle={handleToggle("operatingExpenseProcessing")}
                    isDisabled={!isEditing}
                    className="w-9"
                  />
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Operating expense and escalation processing
                  </span>
                </div>
                <div className="w-full xs:w-auto">
                  <PixieMonthPicker
                    label="Date to request prior year summary"
                    value={tempFormData.operatingExpenseProcessingValue}
                    onChange={(value) =>
                      setTempFormData((prev) => ({
                        ...prev,
                        operatingExpenseProcessingValue: value,
                      }))
                    }
                    isEditing={isEditing}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
                <div className="flex items-center gap-3">
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    {"Off"}
                  </span>
                  <ToggleSwitch
                    isOn={tempFormData.realEstateTaxRequests}
                    onToggle={handleToggle("realEstateTaxRequests")}
                    isDisabled={!isEditing}
                    className="w-9"
                  />
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Real estate tax payment requests in workflows
                  </span>
                </div>
                <div className="w-full xs:w-auto">
                  <PixieDropdown
                    label="Days prior to target payment date"
                    options={realEstateTaxRequestsOptions}
                    value={tempFormData.realEstateTaxRequestsValue}
                    onChange={(value) =>
                      setTempFormData((prev) => ({
                        ...prev,
                        realEstateTaxRequestsValue: value,
                      }))
                    }
                    isEditing={isEditing}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
                <div className="flex items-center gap-3">
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    {"Off"}
                  </span>
                  <ToggleSwitch
                    isOn={tempFormData.propertyInsuranceRenewal}
                    onToggle={handleToggle("propertyInsuranceRenewal")}
                    isDisabled={!isEditing}
                    className="w-9"
                  />
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Property insurance renewal in workflows
                  </span>
                </div>
                <div className="w-full xs:w-auto">
                  <PixieDropdown
                    label="Days prior to expiration"
                    options={propertyInsuranceRenewalOptions}
                    value={tempFormData.propertyInsuranceRenewalValue}
                    onChange={(value) =>
                      setTempFormData((prev) => ({
                        ...prev,
                        propertyInsuranceRenewalValue: value,
                      }))
                    }
                    isEditing={isEditing}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
                <div className="flex items-center gap-3">
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    {"Off"}
                  </span>
                  <ToggleSwitch
                    isOn={tempFormData.tenantInsuranceCertificates}
                    onToggle={handleToggle("tenantInsuranceCertificates")}
                    isDisabled={!isEditing}
                    className="w-9"
                  />
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Tenant required insurance certificates in workflows
                  </span>
                </div>
                <div className="w-full xs:w-auto">
                  <PixieDropdown
                    label="Start days prior to expiration"
                    options={tenantInsuranceCertificatesOptions}
                    value={tempFormData.tenantInsuranceCertificatesValue}
                    onChange={(value) =>
                      setTempFormData((prev) => ({
                        ...prev,
                        tenantInsuranceCertificatesValue: value,
                      }))
                    }
                    isEditing={isEditing}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:gap-[50px]">
                <div className="flex items-center gap-3">
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    {"Off"}
                  </span>
                  <ToggleSwitch
                    isOn={tempFormData.tenantHVACMaintenance}
                    onToggle={handleToggle("tenantHVACMaintenance")}
                    isDisabled={!isEditing}
                    className="w-9"
                  />
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Tenant required HVAC maintenance documentation in workflows
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:gap-[50px]">
                <div className="flex items-center gap-3">
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    {"Off"}
                  </span>
                  <ToggleSwitch
                    isOn={tempFormData.tenantPestControl}
                    onToggle={handleToggle("tenantPestControl")}
                    isDisabled={!isEditing}
                    className="w-9"
                  />
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Tenant required pest control service documentation in
                    workflows
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:gap-[50px]">
                <div className="flex items-center gap-3">
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    {"Off"}
                  </span>
                  <ToggleSwitch
                    isOn={tempFormData.restaurantHoodInspection}
                    onToggle={handleToggle("restaurantHoodInspection")}
                    isDisabled={!isEditing}
                    className="w-9"
                  />
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Restaurant required hood and suppression inspection
                    documentation in workflows
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:gap-[50px]">
                <div className="flex items-center gap-3">
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    {"Off"}
                  </span>
                  <ToggleSwitch
                    isOn={tempFormData.tenantSalesReporting}
                    onToggle={handleToggle("tenantSalesReporting")}
                    isDisabled={!isEditing}
                    className="w-9"
                  />
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Tenant required sales reporting documentation in workflows
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:gap-[50px]">
                <div className="flex items-center gap-3">
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    {"Off"}
                  </span>
                  <ToggleSwitch
                    isOn={tempFormData.tenantSatisfactionSurvey}
                    onToggle={handleToggle("tenantSatisfactionSurvey")}
                    isDisabled={!isEditing}
                    className="w-9"
                  />
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Tenant satisfaction survey in workflows
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:gap-[50px]">
                <div className="flex items-center gap-3">
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    {"Off"}
                  </span>
                  <ToggleSwitch
                    isOn={tempFormData.vendorW9Request}
                    onToggle={handleToggle("vendorW9Request")}
                    isDisabled={!isEditing}
                    className="w-9"
                  />
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Vendor W-9 request in workflows
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:gap-[50px]">
                <div className="flex items-center gap-3">
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    {"Off"}
                  </span>
                  <ToggleSwitch
                    isOn={tempFormData.scheduledMaintenance}
                    onToggle={handleToggle("scheduledMaintenance")}
                    isDisabled={!isEditing}
                    className="w-9"
                  />
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Scheduled maintenance in workflows
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
                <div className="flex items-center gap-3">
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    {"Off"}
                  </span>
                  <ToggleSwitch
                    isOn={tempFormData.meterReadings}
                    onToggle={handleToggle("meterReadings")}
                    isDisabled={!isEditing}
                    className="w-9"
                  />
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Meter readings in workflows
                  </span>
                </div>
                <div className="w-full xs:w-auto">
                  <PixieDropdown
                    label="Start days prior to target read date"
                    options={meterReadingsOptions}
                    value={tempFormData.meterReadingsValue}
                    onChange={(value) =>
                      setTempFormData((prev) => ({
                        ...prev,
                        meterReadingsValue: value,
                      }))
                    }
                    isEditing={isEditing}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
                  <div className="flex items-center gap-3">
                    <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                      {"Off"}
                    </span>
                    <ToggleSwitch
                      isOn={tempFormData.maintenanceWorkApprovals}
                      onToggle={handleToggle("maintenanceWorkApprovals")}
                      isDisabled={!isEditing}
                      className="w-9"
                    />
                    <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                      Maintenance work approvals in workflows
                    </span>
                  </div>
                  <div className="w-full xs:w-auto">
                    <PixieDropdown
                      label="Property group approval over"
                      options={maintenanceWorkApprovalsPropertyGroupOptions}
                      value={
                        tempFormData.maintenanceWorkApprovalsPropertyGroupValue
                      }
                      onChange={(value) =>
                        setTempFormData((prev) => ({
                          ...prev,
                          maintenanceWorkApprovalsPropertyGroupValue: value,
                        }))
                      }
                      isEditing={isEditing}
                    />
                  </div>
                </div>
                <div className="w-full xs:w-auto flex justify-end">
                  <PixieDropdown
                    label="Portfolio user approval over"
                    options={maintenanceWorkApprovalsPortfolioUserOptions}
                    value={
                      tempFormData.maintenanceWorkApprovalsPortfolioUserValue
                    }
                    onChange={(value) =>
                      setTempFormData((prev) => ({
                        ...prev,
                        maintenanceWorkApprovalsPortfolioUserValue: value,
                      }))
                    }
                    isEditing={isEditing}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
                <div className="flex items-center gap-3">
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    {"Off"}
                  </span>
                  <ToggleSwitch
                    isOn={tempFormData.vendor1099Processing}
                    onToggle={handleToggle("vendor1099Processing")}
                    isDisabled={!isEditing}
                    className="w-9"
                  />
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Vendor 1099 processing in workflows
                  </span>
                </div>
                <div className="w-full xs:w-auto">
                  <PixieMonthPicker
                    label="Date to request annual payments summary"
                    value={tempFormData.vendor1099ProcessingValue}
                    onChange={(value) =>
                      setTempFormData((prev) => ({
                        ...prev,
                        vendor1099ProcessingValue: value,
                      }))
                    }
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </form>
          </>
        )}

        {isEditing && (
          <div className="flex flex-col items-center gap-4">
            <PixieButton
              label="Update"
              disabled={false}
              type="submit"
              formId="portfolio-automation-card"
              className="w-full"
            />
            <div className="flex justify-center">
              <LinkButton onClick={handleCancel} />
            </div>
          </div>
        )}
      </div>
    </ClientThemeWrapper>
  );
};
