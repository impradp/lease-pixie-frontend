"use client";

import React, { useState, useEffect } from "react";
import { DropdownOption } from "@/types/user";
import handleInfo from "@/lib/utils/errorHandler";
import { NewVendorFormData } from "@/types/vendor";
import { portfolioService } from "@/lib/services/portfolio";
import PixieButton from "@/components/ui/buttons/PixieButton";
import LinkButton from "@/components/ui/buttons/LinkButton";
import { NewVendor } from "@/components/portfolio/vendor/NewVendor";
import { SectionHeader } from "@/components/ui/header/SectionHeader";
import { CustomDropdown } from "@/components/ui/input/CustomDropdown";
import { IconLinkButton } from "@/components/ui/buttons/IconLinkButton";

/**
 * Form data structure for workflow seats
 */
interface WorkflowSeatsFormData {
  maintenanceSeat: DropdownOption | undefined; // Selected maintenance seat
  accountingSeat: DropdownOption | undefined; // Selected accounting seat
  leaseSeat: DropdownOption | undefined; // Selected lease seat
  billPaySeat: DropdownOption | undefined; // Selected bill pay seat
}

/**
 * Options for seat dropdowns
 */
interface SeatOptions {
  maintenanceSeats: DropdownOption[]; // Options for maintenance seats
  accountingSeats: DropdownOption[]; // Options for accounting seats
  leaseSeats: DropdownOption[]; // Options for lease seats
  billPaySeats: DropdownOption[]; // Options for bill pay seats
}

/**
 * Props for the WorkflowSeats component
 */
interface WorkflowSeatsProps {
  label?: string; // Label for the component
  initialFormData: WorkflowSeatsFormData; // Initial seat selections
  onFormDataChange: (formData: WorkflowSeatsFormData) => void; // Callback for form data changes
  seatOptions: SeatOptions; // Available seat options
  showInfo?: boolean; // Whether to show info tooltips
  infoContents?: string[]; // Content for info tooltips
  sectionId: string; // Unique identifier for the section
  editingSection: string | null; // Currently editing section ID
  onSectionEdit: (section: string) => void; // Callback for entering edit mode
  onSectionClose: () => void; // Callback for closing edit mode
  subLabels: string[]; // Labels for dropdowns
}

/**
 * Renders a component for managing workflow seats with dropdowns for different roles
 * @param props - The properties for configuring the component
 * @returns JSX.Element - The rendered workflow seats component
 */
const WorkflowSeats: React.FC<WorkflowSeatsProps> = ({
  label = "",
  initialFormData,
  onFormDataChange,
  seatOptions,
  showInfo,
  infoContents = [],
  sectionId,
  editingSection,
  onSectionEdit,
  onSectionClose,
  subLabels = [
    "Selected Seat 1",
    "Selected Seat 2",
    "Selected Seat 3",
    "Selected Seat 4",
  ],
}) => {
  const [formData, setFormData] =
    useState<WorkflowSeatsFormData>(initialFormData); // Current form data
  const [originalFormData, setOriginalFormData] =
    useState<WorkflowSeatsFormData>(initialFormData); // Original form data
  const [showNewSeatModal, setShowNewSeatModal] = useState(false); // Controls new vendor modal visibility
  const [isEditMode, setIsEditMode] = useState(false); // Tracks edit mode state

  /**
   * Syncs form data with initial props
   */
  useEffect(() => {
    // Updates state when initial form data changes
    setFormData(initialFormData);
    setOriginalFormData(initialFormData);
  }, [initialFormData]);

  /**
   * Manages body overflow based on modal visibility
   */
  useEffect(() => {
    // Locks/unlocks scroll when modal is open
    if (showNewSeatModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showNewSeatModal]);

  /**
   * Handles adding a new vendor via API
   * @param userData - Data for the new vendor
   * @param setLoading - Function to toggle loading state
   */
  const handleAddVendor = async (
    userData: NewVendorFormData,
    setLoading: (loading: boolean) => void
  ) => {
    // Submits new vendor data
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await portfolioService.addVendor(userData);
      if (response?.status === "SUCCESS") {
        setShowNewSeatModal(false);
        handleInfo({ code: 100510 });
      } else {
        handleInfo({ code: 100511 });
      }
    } catch (err) {
      handleInfo({ code: 100512, error: err });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Closes the new vendor modal
   */
  const handleCloseSeatModal = () => {
    // Hides the new vendor modal
    setShowNewSeatModal(false);
  };

  /**
   * Enters edit mode for the section
   */
  const handleEdit = () => {
    // Initiates edit mode if allowed
    if (editingSection === null || editingSection === sectionId) {
      setIsEditMode(true);
      onSectionEdit(sectionId);
    }
  };

  /**
   * Cancels edit mode and reverts changes
   */
  const handleTextClose = () => {
    // Exits edit mode and reverts form data
    setIsEditMode(false);
    setFormData(originalFormData);
    onSectionClose();
  };

  /**
   * Saves changes and exits edit mode
   */
  const handleUpdate = () => {
    // Applies form changes and exits edit mode
    setIsEditMode(false);
    onFormDataChange(formData);
    onSectionClose();
  };

  /**
   * Updates a specific field in the form data
   * @param field - The field to update
   * @param value - The new value
   */
  const handleFieldChange = (
    field: keyof WorkflowSeatsFormData,
    value: DropdownOption | undefined
  ) => {
    // Updates a single seat selection
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isEditDisabled =
    editingSection !== null && editingSection !== sectionId; // Determines if edit is disabled

  return (
    <>
      <div
        className={`rounded-xl p-6 flex flex-col gap-4 ${
          isEditMode ? "bg-card-open-fill" : "bg-card-close-fill"
        }`}
      >
        <SectionHeader
          title={label}
          onEdit={handleEdit}
          onTextCancel={handleTextClose}
          showEditButton={!isEditMode}
          showTextCloseButton={isEditMode}
          editDisabled={isEditDisabled}
        />
        <CustomDropdown
          options={seatOptions.maintenanceSeats}
          value={formData.maintenanceSeat?.value}
          onChange={
            isEditMode
              ? (option) => handleFieldChange("maintenanceSeat", option)
              : undefined
          }
          readOnly={!isEditMode}
          isEditing={isEditMode}
          label={subLabels[0]}
          showInfo={showInfo}
          infoContent={infoContents[0]}
        />
        {isEditMode && (
          <IconLinkButton
            label={`Add Vendor`}
            onClick={() => setShowNewSeatModal(true)}
          />
        )}
        <CustomDropdown
          options={seatOptions.accountingSeats}
          value={formData.accountingSeat?.value}
          onChange={
            isEditMode
              ? (option) => handleFieldChange("accountingSeat", option)
              : undefined
          }
          readOnly={!isEditMode}
          isEditing={isEditMode}
          label={subLabels[1]}
          showInfo={showInfo}
          infoContent={infoContents[1]}
        />
        {isEditMode && (
          <IconLinkButton
            label={`Add Vendor`}
            onClick={() => setShowNewSeatModal(true)}
          />
        )}
        <CustomDropdown
          options={seatOptions.leaseSeats}
          value={formData.leaseSeat?.value}
          onChange={
            isEditMode
              ? (option) => handleFieldChange("leaseSeat", option)
              : undefined
          }
          readOnly={!isEditMode}
          isEditing={isEditMode}
          label={subLabels[2]}
          showInfo={showInfo}
          infoContent={infoContents[2]}
        />
        {isEditMode && (
          <IconLinkButton
            label={`Add Vendor`}
            onClick={() => setShowNewSeatModal(true)}
          />
        )}
        <CustomDropdown
          options={seatOptions.billPaySeats}
          value={formData.billPaySeat?.value}
          onChange={
            isEditMode
              ? (option) => handleFieldChange("billPaySeat", option)
              : undefined
          }
          readOnly={!isEditMode}
          isEditing={isEditMode}
          label={subLabels[3]}
          showInfo={showInfo}
          infoContent={infoContents[3]}
        />
        {isEditMode && (
          <>
            <IconLinkButton
              label={`Add Vendor`}
              onClick={() => setShowNewSeatModal(true)}
            />
            <div className="flex flex-col gap-3">
              <PixieButton
                label="Update"
                disabled={false}
                onClick={handleUpdate}
                className="w-full"
              />
              <div className="flex justify-center">
                <LinkButton onClick={handleTextClose} />
              </div>
            </div>
          </>
        )}
      </div>
      {showNewSeatModal && (
        <div className="fixed inset-0 z-50">
          <div className="relative z-50">
            <NewVendor
              onClose={handleCloseSeatModal}
              onSubmit={handleAddVendor}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default WorkflowSeats;
