import React, { useState, useEffect } from "react";

import toastr from "@/lib/func/toastr";
import { DropdownOption } from "@/types/user";
import { NewVendorFormData } from "@/types/vendor";
import { portfolioService } from "@/lib/services/portfolio";
import PixieButton from "@/components/ui/buttons/PixieButton";
import CancelButton from "@/components/ui/buttons/CancelButton";
import { NewVendor } from "@/components/portfolio/vendor/NewVendor";
import { SectionHeader } from "@/components/ui/header/SectionHeader";
import { CustomDropdown } from "@/components/ui/input/CustomDropdown";
import { IconLinkButton } from "@/components/ui/buttons/IconLinkButton";

interface WorkflowSeatsFormData {
  maintenanceSeat: DropdownOption | undefined;
  accountingSeat: DropdownOption | undefined;
  leaseSeat: DropdownOption | undefined;
  billPaySeat: DropdownOption | undefined;
}

interface SeatOptions {
  maintenanceSeats: DropdownOption[];
  accountingSeats: DropdownOption[];
  leaseSeats: DropdownOption[];
  billPaySeats: DropdownOption[];
}

interface WorkflowSeatsProps {
  label?: string;
  initialFormData: WorkflowSeatsFormData;
  onFormDataChange: (formData: WorkflowSeatsFormData) => void;
  seatOptions: SeatOptions;
  showInfo?: boolean;
  infoContents?: string[];
  sectionId: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
  subLabels: string[];
}

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
    useState<WorkflowSeatsFormData>(initialFormData);
  const [originalFormData, setOriginalFormData] =
    useState<WorkflowSeatsFormData>(initialFormData);
  const [showNewSeatModal, setShowNewSeatModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setFormData(initialFormData);
    setOriginalFormData(initialFormData);
  }, [initialFormData]);

  useEffect(() => {
    if (showNewSeatModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showNewSeatModal]);

  const handleAddVendor = async (
    userData: NewVendorFormData,
    setLoading: (loading: boolean) => void
  ) => {
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const response = await portfolioService.addVendor(userData);
      if (response?.status === "SUCCESS") {
        setShowNewSeatModal(false);
        toastr({
          message: "New portfolio vendor added successfully.",
          toastrType: "success",
        });
      } else {
        toastr({
          message: "Error adding new portfolio vendor.",
          toastrType: "error",
        });
      }
    } catch {
      //TODO: Handle log
      toastr({
        message: "Exception occured adding new portfolio vendor.",
        toastrType: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSeatModal = () => {
    setShowNewSeatModal(false);
  };

  const handleEdit = () => {
    if (editingSection === null || editingSection === sectionId) {
      setIsEditMode(true);
      onSectionEdit(sectionId);
    }
  };

  const handleTextClose = () => {
    setIsEditMode(false);
    setFormData(originalFormData);
    onSectionClose();
  };

  const handleUpdate = () => {
    setIsEditMode(false);
    onFormDataChange(formData);
    onSectionClose();
  };

  const handleFieldChange = (
    field: keyof WorkflowSeatsFormData,
    value: DropdownOption | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isEditDisabled =
    editingSection !== null && editingSection !== sectionId;

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
              <CancelButton onClick={handleTextClose} />
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
