"use client";

import React, { useState, useEffect, useRef } from "react";
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
 * Props for the PortfolioVendors component
 */
interface PortfolioVendorsProps {
  label?: string;
  selectedVendor?: DropdownOption;
  selectedSecondaryVendor?: DropdownOption;
  selectedTertiaryVendor?: DropdownOption;
  onVendorChange?: (vendor: DropdownOption) => void;
  onSecondaryVendorChange?: (vendor: DropdownOption) => void;
  onTertiaryVendorChange?: (vendor: DropdownOption) => void;
  vendors: DropdownOption[];
  secondaryVendors: DropdownOption[];
  tertiaryVendors: DropdownOption[];
  onAddVendor?: (vendorData: NewVendorFormData) => void;
  showInfo?: boolean;
  infoContents?: string[];
  vendorType?: string;
  sectionId: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
  subLabels: string[];
  refreshVendors: () => void;
  onClickUpdate?: () => void;
}

/**
 * Renders a component for managing primary, secondary, and tertiary portfolio vendors
 * @param props - The properties for configuring the component
 * @returns JSX.Element - The rendered portfolio vendors component
 */
export const PortfolioVendors: React.FC<PortfolioVendorsProps> = ({
  label = "",
  selectedVendor = { value: "", label: "" },
  selectedSecondaryVendor = { value: "", label: "" },
  selectedTertiaryVendor = { value: "", label: "" },
  onVendorChange,
  onSecondaryVendorChange,
  onTertiaryVendorChange,
  vendors,
  secondaryVendors,
  tertiaryVendors,
  showInfo,
  infoContents = [],
  vendorType = "Vendor",
  sectionId,
  editingSection,
  onSectionEdit,
  onSectionClose,
  subLabels = ["Selected Vendor 1", "Selected Vendor 2", "Selected Vendor 3"],
  refreshVendors,
  onClickUpdate,
}) => {
  const [showNewVendorModal, setShowNewVendorModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedVendor, setEditedVendor] =
    useState<DropdownOption>(selectedVendor);
  const [editedSecondaryVendor, setEditedSecondaryVendor] =
    useState<DropdownOption>(selectedSecondaryVendor);
  const [editedTertiaryVendor, setEditedTertiaryVendor] =
    useState<DropdownOption>(selectedTertiaryVendor);
  const originalVendorRef = useRef<DropdownOption>(selectedVendor);
  const originalSecondaryVendorRef = useRef<DropdownOption>(
    selectedSecondaryVendor
  );
  const originalTertiaryVendorRef = useRef<DropdownOption>(
    selectedTertiaryVendor
  );
  const [localVendors, setLocalVendors] = useState<DropdownOption[]>(vendors);
  const [localSecondaryVendors, setLocalSecondaryVendors] =
    useState<DropdownOption[]>(secondaryVendors);
  const [localTertiaryVendors, setLocalTertiaryVendors] =
    useState<DropdownOption[]>(tertiaryVendors);
  const [triggeredBy, setTriggeredBy] = useState<string | null>(null);

  const isEditing = isEditMode;

  /**
   * Syncs internal state with props and validates selected vendors against options
   */
  useEffect(() => {
    setLocalVendors(vendors);
    setLocalSecondaryVendors(secondaryVendors);
    setLocalTertiaryVendors(tertiaryVendors);
    if (!isEditMode) {
      setEditedVendor({ ...selectedVendor });
      setEditedSecondaryVendor({ ...selectedSecondaryVendor });
      setEditedTertiaryVendor({ ...selectedTertiaryVendor });
    }
  }, [
    vendors,
    secondaryVendors,
    tertiaryVendors,
    selectedVendor,
    selectedSecondaryVendor,
    selectedTertiaryVendor,
    isEditMode,
  ]);

  /**
   * Manages body overflow based on modal visibility
   */
  useEffect(() => {
    if (showNewVendorModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showNewVendorModal]);

  /**
   * Adds a new vendor via API
   * @param vendorData - Data for the new vendor
   * @param setLoading - Function to toggle loading state
   */
  const handleAddVendor = async (
    vendorData: NewVendorFormData,
    setLoading: (loading: boolean) => void
  ) => {
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await portfolioService.addVendor(vendorData);
      if (response?.status === "SUCCESS") {
        setShowNewVendorModal(false);
        handleInfo({ code: 100510 });

        const newVendor: DropdownOption = {
          value: String(response.data.id),
          label: response.data.companyName,
          subLabel: response.data.companyAddress,
        };

        setLocalVendors((prev) => [...prev, newVendor]);
        setLocalSecondaryVendors((prev) => [...prev, newVendor]);
        setLocalTertiaryVendors((prev) => [...prev, newVendor]);

        if (triggeredBy === "primary") {
          setEditedVendor(newVendor);
        } else if (triggeredBy === "secondary") {
          setEditedSecondaryVendor(newVendor);
        } else if (triggeredBy === "tertiary") {
          setEditedTertiaryVendor(newVendor);
        }

        await refreshVendors();
      } else {
        handleInfo({ code: 100511 });
      }
    } catch (err) {
      handleInfo({ code: 100512, error: err });
    } finally {
      setLoading(false);
      setTriggeredBy(null);
    }
  };

  /**
   * Closes the new vendor modal
   */
  const handleCloseVendorModal = () => {
    setShowNewVendorModal(false);
  };

  /**
   * Enters edit mode for the section
   */
  const handleEdit = () => {
    if (editingSection === null || editingSection === sectionId) {
      setIsEditMode(true);
      onSectionEdit(sectionId);
      setEditedVendor({ ...selectedVendor });
      setEditedSecondaryVendor({ ...selectedSecondaryVendor });
      setEditedTertiaryVendor({ ...selectedTertiaryVendor });
    }
  };

  /**
   * Cancels edit mode and reverts changes
   */
  const handleTextClose = () => {
    setIsEditMode(false);
    setEditedVendor({ ...originalVendorRef.current });
    setEditedSecondaryVendor({ ...originalSecondaryVendorRef.current });
    setEditedTertiaryVendor({ ...originalTertiaryVendorRef.current });
    onSectionClose();
  };

  /**
   * Saves changes and exits edit mode
   */
  const handleUpdate = () => {
    setIsEditMode(false);
    if (onVendorChange && editedVendor) {
      onVendorChange(editedVendor);
    }
    if (onSecondaryVendorChange && editedSecondaryVendor) {
      onSecondaryVendorChange(editedSecondaryVendor);
    }
    if (onTertiaryVendorChange && editedTertiaryVendor) {
      onTertiaryVendorChange(editedTertiaryVendor);
    }
    originalVendorRef.current = { ...editedVendor };
    originalSecondaryVendorRef.current = { ...editedSecondaryVendor };
    originalTertiaryVendorRef.current = { ...editedTertiaryVendor };
    onClickUpdate?.();
    onSectionClose();
  };

  /**
   * Updates the edited primary vendor
   * @param vendor - The selected vendor
   */
  const handleVendorChange = (vendor: DropdownOption) => {
    setEditedVendor(vendor);
  };

  /**
   * Updates the edited secondary vendor
   * @param vendor - The selected vendor
   */
  const handleSecondaryVendorChange = (vendor: DropdownOption) => {
    setEditedSecondaryVendor(vendor);
  };

  /**
   * Updates the edited tertiary vendor
   * @param vendor - The selected vendor
   */
  const handleTertiaryVendorChange = (vendor: DropdownOption) => {
    setEditedTertiaryVendor(vendor);
  };

  const handlePrimaryAddVendorClick = () => {
    setShowNewVendorModal(true);
    setTriggeredBy("primary");
  };

  const handleSecondaryAddVendorClick = () => {
    setShowNewVendorModal(true);
    setTriggeredBy("secondary");
  };

  const handleTertiaryAddVendorClick = () => {
    setShowNewVendorModal(true);
    setTriggeredBy("tertiary");
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
          options={localVendors}
          value={editedVendor?.value || ""}
          onChange={isEditing ? handleVendorChange : undefined}
          readOnly={!isEditing}
          isEditing={isEditing}
          label={subLabels[0]}
          showInfo={showInfo}
          infoContent={infoContents[0]}
        />
        {isEditMode && (
          <IconLinkButton
            label={`Add ${vendorType}`}
            onClick={handlePrimaryAddVendorClick}
          />
        )}
        <CustomDropdown
          options={localSecondaryVendors}
          value={editedSecondaryVendor?.value || ""}
          onChange={isEditing ? handleSecondaryVendorChange : undefined}
          readOnly={!isEditing}
          isEditing={isEditing}
          label={subLabels[1]}
          showInfo={showInfo}
          infoContent={infoContents[1]}
        />
        {isEditMode && (
          <IconLinkButton
            label={`Add ${vendorType}`}
            onClick={handleSecondaryAddVendorClick}
          />
        )}
        <CustomDropdown
          options={localTertiaryVendors}
          value={editedTertiaryVendor?.value || ""}
          onChange={isEditing ? handleTertiaryVendorChange : undefined}
          readOnly={!isEditing}
          isEditing={isEditing}
          label={subLabels[2]}
          showInfo={showInfo}
          infoContent={infoContents[2]}
        />
        {isEditMode && (
          <>
            <IconLinkButton
              label={`Add ${vendorType}`}
              onClick={handleTertiaryAddVendorClick}
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
      {showNewVendorModal && (
        <div className="fixed inset-0 z-50">
          <div className="relative z-50">
            <NewVendor
              onClose={handleCloseVendorModal}
              onSubmit={handleAddVendor}
            />
          </div>
        </div>
      )}
    </>
  );
};
