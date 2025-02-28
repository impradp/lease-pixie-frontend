"use client";

import React, { useState, useEffect } from "react";

import { RefreshCcw } from "lucide-react";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { ToggleSwitch } from "@/components/ui/input/ToggleSwitch";
import CancelButton from "@/components/ui/buttons/CancelButton";
import { PixieDropdown } from "@/components/ui/input/PixieDropdown";
import { SectionHeader } from "@/components/ui/header/SectionHeader";
import { PixieMonthPicker } from "@/components/ui/datePicker/PixieMonthPicker";
import { ClientThemeWrapper } from "@/components/ui/ClientThemeWrapper";

interface PortfolioAutomationSyncProps {
  sectionId: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
  label?: string;
  title?: string;
  info?: string;
}

export const PortfolioAutomationSync: React.FC<
  PortfolioAutomationSyncProps
> = ({
  sectionId,
  editingSection,
  onSectionEdit,
  onSectionClose,
  label,
  title,
  info,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Persistent state (all strings)
  const [syncAutomation, setSyncAutomation] = useState(false);
  const [invoiceCreation, setInvoiceCreation] = useState(false);
  const [invoiceCreationValue, setInvoiceCreationValue] = useState("-15");
  const [invoiceEmail, setInvoiceEmail] = useState(false);
  const [invoiceEmailValue, setInvoiceEmailValue] = useState("13");
  const [invoicePaperMail, setInvoicePaperMail] = useState(false);
  const [invoicePaperMailValue, setInvoicePaperMailValue] = useState("23");
  const [invoiceReminderEmail, setInvoiceReminderEmail] = useState(false);
  const [invoiceReminderEmailValue, setInvoiceReminderEmailValue] =
    useState("30");
  const [invoiceDefaultNoticeMail, setInvoiceDefaultNoticeMail] =
    useState(false);
  const [invoiceDefaultNoticeMailValue, setInvoiceDefaultNoticeMailValue] =
    useState("30/45/60/90");
  const [operatingExpenseProcessing, setOperatingExpenseProcessing] =
    useState(false);
  const [operatingExpenseProcessingValue, setOperatingExpenseProcessingValue] =
    useState("January 7");
  const [realEstateTaxRequests, setRealEstateTaxRequests] = useState(false);
  const [realEstateTaxRequestsValue, setRealEstateTaxRequestsValue] =
    useState("Select");
  const [propertyInsuranceRenewal, setPropertyInsuranceRenewal] =
    useState(false);
  const [propertyInsuranceRenewalValue, setPropertyInsuranceRenewalValue] =
    useState("40");
  const [tenantInsuranceCertificates, setTenantInsuranceCertificates] =
    useState(false);
  const [
    tenantInsuranceCertificatesValue,
    setTenantInsuranceCertificatesValue,
  ] = useState("20");
  const [tenantHVACMaintenance, setTenantHVACMaintenance] = useState(false);
  const [tenantPestControl, setTenantPestControl] = useState(false);
  const [restaurantHoodInspection, setRestaurantHoodInspection] =
    useState(false);
  const [tenantSalesReporting, setTenantSalesReporting] = useState(false);
  const [tenantSatisfactionSurvey, setTenantSatisfactionSurvey] =
    useState(false);
  const [vendorW9Request, setVendorW9Request] = useState(false);
  const [scheduledMaintenance, setScheduledMaintenance] = useState(false);
  const [meterReadings, setMeterReadings] = useState(false);
  const [meterReadingsValue, setMeterReadingsValue] = useState("Select");
  const [maintenanceWorkApprovals, setMaintenanceWorkApprovals] =
    useState(false);
  const [
    maintenanceWorkApprovalsPropertyGroupValue,
    setMaintenanceWorkApprovalsPropertyGroupValue,
  ] = useState("$500");
  const [
    maintenanceWorkApprovalsPortfolioUserValue,
    setMaintenanceWorkApprovalsPortfolioUserValue,
  ] = useState("$5,000");
  const [vendor1099Processing, setVendor1099Processing] = useState(false);
  const [vendor1099ProcessingValue, setVendor1099ProcessingValue] =
    useState("January 7");

  // Temporary state (all strings)
  const [tempSyncAutomation, setTempSyncAutomation] = useState(syncAutomation);
  const [tempInvoiceCreation, setTempInvoiceCreation] =
    useState(invoiceCreation);
  const [tempInvoiceCreationValue, setTempInvoiceCreationValue] =
    useState(invoiceCreationValue);
  const [tempInvoiceEmail, setTempInvoiceEmail] = useState(invoiceEmail);
  const [tempInvoiceEmailValue, setTempInvoiceEmailValue] =
    useState(invoiceEmailValue);
  const [tempInvoicePaperMail, setTempInvoicePaperMail] =
    useState(invoicePaperMail);
  const [tempInvoicePaperMailValue, setTempInvoicePaperMailValue] = useState(
    invoicePaperMailValue
  );
  const [tempInvoiceReminderEmail, setTempInvoiceReminderEmail] =
    useState(invoiceReminderEmail);
  const [tempInvoiceReminderEmailValue, setTempInvoiceReminderEmailValue] =
    useState(invoiceReminderEmailValue);
  const [tempInvoiceDefaultNoticeMail, setTempInvoiceDefaultNoticeMail] =
    useState(invoiceDefaultNoticeMail);
  const [
    tempInvoiceDefaultNoticeMailValue,
    setTempInvoiceDefaultNoticeMailValue,
  ] = useState(invoiceDefaultNoticeMailValue);
  const [tempOperatingExpenseProcessing, setTempOperatingExpenseProcessing] =
    useState(operatingExpenseProcessing);
  const [
    tempOperatingExpenseProcessingValue,
    setTempOperatingExpenseProcessingValue,
  ] = useState(operatingExpenseProcessingValue);
  const [tempRealEstateTaxRequests, setTempRealEstateTaxRequests] = useState(
    realEstateTaxRequests
  );
  const [tempRealEstateTaxRequestsValue, setTempRealEstateTaxRequestsValue] =
    useState(realEstateTaxRequestsValue);
  const [tempPropertyInsuranceRenewal, setTempPropertyInsuranceRenewal] =
    useState(propertyInsuranceRenewal);
  const [
    tempPropertyInsuranceRenewalValue,
    setTempPropertyInsuranceRenewalValue,
  ] = useState(propertyInsuranceRenewalValue);
  const [tempTenantInsuranceCertificates, setTempTenantInsuranceCertificates] =
    useState(tenantInsuranceCertificates);
  const [
    tempTenantInsuranceCertificatesValue,
    setTempTenantInsuranceCertificatesValue,
  ] = useState(tenantInsuranceCertificatesValue);
  const [tempTenantHVACMaintenance, setTempTenantHVACMaintenance] = useState(
    tenantHVACMaintenance
  );
  const [tempTenantPestControl, setTempTenantPestControl] =
    useState(tenantPestControl);
  const [tempRestaurantHoodInspection, setTempRestaurantHoodInspection] =
    useState(restaurantHoodInspection);
  const [tempTenantSalesReporting, setTempTenantSalesReporting] =
    useState(tenantSalesReporting);
  const [tempTenantSatisfactionSurvey, setTempTenantSatisfactionSurvey] =
    useState(tenantSatisfactionSurvey);
  const [tempVendorW9Request, setTempVendorW9Request] =
    useState(vendorW9Request);
  const [tempScheduledMaintenance, setTempScheduledMaintenance] =
    useState(scheduledMaintenance);
  const [tempMeterReadings, setTempMeterReadings] = useState(meterReadings);
  const [tempMeterReadingsValue, setTempMeterReadingsValue] =
    useState(meterReadingsValue);
  const [tempMaintenanceWorkApprovals, setTempMaintenanceWorkApprovals] =
    useState(maintenanceWorkApprovals);
  const [
    tempMaintenanceWorkApprovalsPropertyGroupValue,
    setTempMaintenanceWorkApprovalsPropertyGroupValue,
  ] = useState(maintenanceWorkApprovalsPropertyGroupValue);
  const [
    tempMaintenanceWorkApprovalsPortfolioUserValue,
    setTempMaintenanceWorkApprovalsPortfolioUserValue,
  ] = useState(maintenanceWorkApprovalsPortfolioUserValue);
  const [tempVendor1099Processing, setTempVendor1099Processing] =
    useState(vendor1099Processing);
  const [tempVendor1099ProcessingValue, setTempVendor1099ProcessingValue] =
    useState(vendor1099ProcessingValue);

  const [isEditing, setIsEditing] = useState(false);

  // Default options for each dropdown (all strings)
  const invoiceCreationOptions = ["-15", "-10", "-5", "0", "5"];
  const invoiceEmailOptions = ["10", "13", "15", "20", "25"];
  const invoicePaperMailOptions = ["20", "23", "25", "30", "35"];
  const invoiceReminderEmailOptions = ["25", "30", "35", "40", "45"];
  const invoiceDefaultNoticeMailOptions = ["30", "45", "60", "90"];
  const realEstateTaxRequestsOptions = ["Select", "5", "10", "15", "20"];
  const propertyInsuranceRenewalOptions = ["30", "40", "50", "60", "70"];
  const tenantInsuranceCertificatesOptions = ["15", "20", "25", "30", "35"];
  const meterReadingsOptions = ["Select", "5", "10", "15", "20"];
  const maintenanceWorkApprovalsPropertyGroupOptions = [
    "$500",
    "$1,000",
    "$2,000",
    "$5,000",
  ];
  const maintenanceWorkApprovalsPortfolioUserOptions = [
    "$5,000",
    "$10,000",
    "$15,000",
    "$20,000",
  ];

  // Reset temporary state when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setTempSyncAutomation(syncAutomation);
      setTempInvoiceCreation(invoiceCreation);
      setTempInvoiceCreationValue(invoiceCreationValue);
      setTempInvoiceEmail(invoiceEmail);
      setTempInvoiceEmailValue(invoiceEmailValue);
      setTempInvoicePaperMail(invoicePaperMail);
      setTempInvoicePaperMailValue(invoicePaperMailValue);
      setTempInvoiceReminderEmail(invoiceReminderEmail);
      setTempInvoiceReminderEmailValue(invoiceReminderEmailValue);
      setTempInvoiceDefaultNoticeMail(invoiceDefaultNoticeMail);
      setTempInvoiceDefaultNoticeMailValue(invoiceDefaultNoticeMailValue);
      setTempOperatingExpenseProcessing(operatingExpenseProcessing);
      setTempOperatingExpenseProcessingValue(operatingExpenseProcessingValue);
      setTempRealEstateTaxRequests(realEstateTaxRequests);
      setTempRealEstateTaxRequestsValue(realEstateTaxRequestsValue);
      setTempPropertyInsuranceRenewal(propertyInsuranceRenewal);
      setTempPropertyInsuranceRenewalValue(propertyInsuranceRenewalValue);
      setTempTenantInsuranceCertificates(tenantInsuranceCertificates);
      setTempTenantInsuranceCertificatesValue(tenantInsuranceCertificatesValue);
      setTempTenantHVACMaintenance(tenantHVACMaintenance);
      setTempTenantPestControl(tenantPestControl);
      setTempRestaurantHoodInspection(restaurantHoodInspection);
      setTempTenantSalesReporting(tenantSalesReporting);
      setTempTenantSatisfactionSurvey(tenantSatisfactionSurvey);
      setTempVendorW9Request(vendorW9Request);
      setTempScheduledMaintenance(scheduledMaintenance);
      setTempMeterReadings(meterReadings);
      setTempMeterReadingsValue(meterReadingsValue);
      setTempMaintenanceWorkApprovals(maintenanceWorkApprovals);
      setTempMaintenanceWorkApprovalsPropertyGroupValue(
        maintenanceWorkApprovalsPropertyGroupValue
      );
      setTempMaintenanceWorkApprovalsPortfolioUserValue(
        maintenanceWorkApprovalsPortfolioUserValue
      );
      setTempVendor1099Processing(vendor1099Processing);
      setTempVendor1099ProcessingValue(vendor1099ProcessingValue);
    }
  }, [
    isEditing,
    syncAutomation,
    invoiceCreation,
    invoiceCreationValue,
    invoiceEmail,
    invoiceEmailValue,
    invoicePaperMail,
    invoicePaperMailValue,
    invoiceReminderEmail,
    invoiceReminderEmailValue,
    invoiceDefaultNoticeMail,
    invoiceDefaultNoticeMailValue,
    operatingExpenseProcessing,
    operatingExpenseProcessingValue,
    realEstateTaxRequests,
    realEstateTaxRequestsValue,
    propertyInsuranceRenewal,
    propertyInsuranceRenewalValue,
    tenantInsuranceCertificates,
    tenantInsuranceCertificatesValue,
    tenantHVACMaintenance,
    tenantPestControl,
    restaurantHoodInspection,
    tenantSalesReporting,
    tenantSatisfactionSurvey,
    vendorW9Request,
    scheduledMaintenance,
    meterReadings,
    meterReadingsValue,
    maintenanceWorkApprovals,
    maintenanceWorkApprovalsPropertyGroupValue,
    maintenanceWorkApprovalsPortfolioUserValue,
    vendor1099Processing,
    vendor1099ProcessingValue,
  ]);

  const handleEdit = () => {
    if (editingSection === null || editingSection === sectionId) {
      setIsEditing(true);
      onSectionEdit(sectionId);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    onSectionClose();
  };

  const handleUpdate = () => {
    setSyncAutomation(tempSyncAutomation);
    setInvoiceCreation(tempInvoiceCreation);
    setInvoiceCreationValue(tempInvoiceCreationValue);
    setInvoiceEmail(tempInvoiceEmail);
    setInvoiceEmailValue(tempInvoiceEmailValue);
    setInvoicePaperMail(tempInvoicePaperMail);
    setInvoicePaperMailValue(tempInvoicePaperMailValue);
    setInvoiceReminderEmail(tempInvoiceReminderEmail);
    setInvoiceReminderEmailValue(tempInvoiceReminderEmailValue);
    setInvoiceDefaultNoticeMail(tempInvoiceDefaultNoticeMail);
    setInvoiceDefaultNoticeMailValue(tempInvoiceDefaultNoticeMailValue);
    setOperatingExpenseProcessing(tempOperatingExpenseProcessing);
    setOperatingExpenseProcessingValue(tempOperatingExpenseProcessingValue);
    setRealEstateTaxRequests(tempRealEstateTaxRequests);
    setRealEstateTaxRequestsValue(tempRealEstateTaxRequestsValue);
    setPropertyInsuranceRenewal(tempPropertyInsuranceRenewal);
    setPropertyInsuranceRenewalValue(tempPropertyInsuranceRenewalValue);
    setTenantInsuranceCertificates(tempTenantInsuranceCertificates);
    setTenantInsuranceCertificatesValue(tempTenantInsuranceCertificatesValue);
    setTenantHVACMaintenance(tempTenantHVACMaintenance);
    setTenantPestControl(tempTenantPestControl);
    setRestaurantHoodInspection(tempRestaurantHoodInspection);
    setTenantSalesReporting(tempTenantSalesReporting);
    setTenantSatisfactionSurvey(tempTenantSatisfactionSurvey);
    setVendorW9Request(tempVendorW9Request);
    setScheduledMaintenance(tempScheduledMaintenance);
    setMeterReadings(tempMeterReadings);
    setMeterReadingsValue(tempMeterReadingsValue);
    setMaintenanceWorkApprovals(tempMaintenanceWorkApprovals);
    setMaintenanceWorkApprovalsPropertyGroupValue(
      tempMaintenanceWorkApprovalsPropertyGroupValue
    );
    setMaintenanceWorkApprovalsPortfolioUserValue(
      tempMaintenanceWorkApprovalsPortfolioUserValue
    );
    setVendor1099Processing(tempVendor1099Processing);
    setVendor1099ProcessingValue(tempVendor1099ProcessingValue);

    setIsEditing(false);
    onSectionClose();
  };

  const handleSyncToggle = () => {
    if (isEditing) {
      setTempSyncAutomation(!tempSyncAutomation);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 5000);
    }
  };

  const handleToggle =
    (setter: React.Dispatch<React.SetStateAction<boolean>>) => () => {
      if (isEditing) {
        setter((prev) => !prev);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 5000);
      }
    };

  const handleDropdownChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (option: { value: string; label: string }) => {
      if (isEditing) {
        setter(option.value);
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
              isOn={isEditing ? tempSyncAutomation : syncAutomation}
              onToggle={handleSyncToggle}
              isDisabled={!isEditing}
              className="w-9"
            />
            <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
              {title ?? ""}
            </span>
          </div>
        </div>

        {isEditing && tempSyncAutomation && (
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
                  Currently pushing automation settings to all Properties
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

            {/* Responsive Toggle + Dropdown Sections */}
            <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
              <div className="flex items-center gap-3">
                <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                  {"Off"}
                </span>
                <ToggleSwitch
                  isOn={tempInvoiceCreation}
                  onToggle={handleToggle(setTempInvoiceCreation)}
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
                  value={tempInvoiceCreationValue}
                  onChange={handleDropdownChange(setTempInvoiceCreationValue)}
                  isEditing={isEditing}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
              <div className="flex items-center gap-3">
                <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                  {"Off"}
                </span>
                <ToggleSwitch
                  isOn={tempInvoiceEmail}
                  onToggle={handleToggle(setTempInvoiceEmail)}
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
                  value={tempInvoiceEmailValue}
                  onChange={handleDropdownChange(setTempInvoiceEmailValue)}
                  isEditing={isEditing}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
              <div className="flex items-center gap-3">
                <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                  {"Off"}
                </span>
                <ToggleSwitch
                  isOn={tempInvoicePaperMail}
                  onToggle={handleToggle(setTempInvoicePaperMail)}
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
                  value={tempInvoicePaperMailValue}
                  onChange={handleDropdownChange(setTempInvoicePaperMailValue)}
                  isEditing={isEditing}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
              <div className="flex items-center gap-3">
                <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                  {"Off"}
                </span>
                <ToggleSwitch
                  isOn={tempInvoiceReminderEmail}
                  onToggle={handleToggle(setTempInvoiceReminderEmail)}
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
                  value={tempInvoiceReminderEmailValue}
                  onChange={handleDropdownChange(
                    setTempInvoiceReminderEmailValue
                  )}
                  isEditing={isEditing}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
              <div className="flex items-center gap-3">
                <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                  {"Off"}
                </span>
                <ToggleSwitch
                  isOn={tempInvoiceDefaultNoticeMail}
                  onToggle={handleToggle(setTempInvoiceDefaultNoticeMail)}
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
                  value={tempInvoiceDefaultNoticeMailValue}
                  onChange={handleDropdownChange(
                    setTempInvoiceDefaultNoticeMailValue
                  )}
                  isEditing={isEditing}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
              <div className="flex items-center gap-3">
                <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                  {"Off"}
                </span>
                <ToggleSwitch
                  isOn={tempOperatingExpenseProcessing}
                  onToggle={handleToggle(setTempOperatingExpenseProcessing)}
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
                  value={tempOperatingExpenseProcessingValue ?? ""}
                  onChange={(value) =>
                    handleDropdownChange(
                      setTempOperatingExpenseProcessingValue
                    )({
                      value,
                      label: value,
                    })
                  }
                  isEditing={isEditing}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
              <div className="flex items-center gap-3">
                <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                  {"Off"}
                </span>
                <ToggleSwitch
                  isOn={tempRealEstateTaxRequests}
                  onToggle={handleToggle(setTempRealEstateTaxRequests)}
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
                  value={tempRealEstateTaxRequestsValue}
                  onChange={handleDropdownChange(
                    setTempRealEstateTaxRequestsValue
                  )}
                  isEditing={isEditing}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
              <div className="flex items-center gap-3">
                <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                  {"Off"}
                </span>
                <ToggleSwitch
                  isOn={tempPropertyInsuranceRenewal}
                  onToggle={handleToggle(setTempPropertyInsuranceRenewal)}
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
                  value={tempPropertyInsuranceRenewalValue}
                  onChange={handleDropdownChange(
                    setTempPropertyInsuranceRenewalValue
                  )}
                  isEditing={isEditing}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
              <div className="flex items-center gap-3">
                <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                  {"Off"}
                </span>
                <ToggleSwitch
                  isOn={tempTenantInsuranceCertificates}
                  onToggle={handleToggle(setTempTenantInsuranceCertificates)}
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
                  value={tempTenantInsuranceCertificatesValue}
                  onChange={handleDropdownChange(
                    setTempTenantInsuranceCertificatesValue
                  )}
                  isEditing={isEditing}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            {/* Toggles without dropdowns remain mostly unchanged */}
            <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:gap-[50px]">
              <div className="flex items-center gap-3">
                <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                  {"Off"}
                </span>
                <ToggleSwitch
                  isOn={tempTenantHVACMaintenance}
                  onToggle={handleToggle(setTempTenantHVACMaintenance)}
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
                  isOn={tempTenantPestControl}
                  onToggle={handleToggle(setTempTenantPestControl)}
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
                  isOn={tempRestaurantHoodInspection}
                  onToggle={handleToggle(setTempRestaurantHoodInspection)}
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
                  isOn={tempTenantSalesReporting}
                  onToggle={handleToggle(setTempTenantSalesReporting)}
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
                  isOn={tempTenantSatisfactionSurvey}
                  onToggle={handleToggle(setTempTenantSatisfactionSurvey)}
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
                  isOn={tempVendorW9Request}
                  onToggle={handleToggle(setTempVendorW9Request)}
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
                  isOn={tempScheduledMaintenance}
                  onToggle={handleToggle(setTempScheduledMaintenance)}
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
                  isOn={tempMeterReadings}
                  onToggle={handleToggle(setTempMeterReadings)}
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
                  value={tempMeterReadingsValue}
                  onChange={handleDropdownChange(setTempMeterReadingsValue)}
                  isEditing={isEditing}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Row 1: Maintenance work approvals and Property group approval */}
              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
                <div className="flex items-center gap-3">
                  <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    {"Off"}
                  </span>
                  <ToggleSwitch
                    isOn={tempMaintenanceWorkApprovals}
                    onToggle={handleToggle(setTempMaintenanceWorkApprovals)}
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
                    value={tempMaintenanceWorkApprovalsPropertyGroupValue}
                    onChange={handleDropdownChange(
                      setTempMaintenanceWorkApprovalsPropertyGroupValue
                    )}
                    isEditing={isEditing}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              {/* Row 2: Portfolio user approval */}
              <div className="w-full xs:w-auto flex justify-end">
                <PixieDropdown
                  label="Portfolio user approval over"
                  options={maintenanceWorkApprovalsPortfolioUserOptions}
                  value={tempMaintenanceWorkApprovalsPortfolioUserValue}
                  onChange={handleDropdownChange(
                    setTempMaintenanceWorkApprovalsPortfolioUserValue
                  )}
                  isEditing={isEditing}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between xs:gap-[50px]">
              <div className="flex items-center gap-3">
                <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                  {"Off"}
                </span>
                <ToggleSwitch
                  isOn={tempVendor1099Processing}
                  onToggle={handleToggle(setTempVendor1099Processing)}
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
                  value={tempVendor1099ProcessingValue ?? ""}
                  onChange={(value) =>
                    handleDropdownChange(setTempVendor1099ProcessingValue)({
                      value,
                      label: value,
                    })
                  }
                  isEditing={isEditing}
                  readOnly={!isEditing}
                />
              </div>
            </div>
          </>
        )}

        {isEditing && (
          <div className="flex flex-col items-center gap-4">
            <PixieButton
              label="Update"
              disabled={false}
              onClick={handleUpdate}
              className="w-full"
            />
            <CancelButton onClick={handleCancel} />
          </div>
        )}
      </div>
    </ClientThemeWrapper>
  );
};
