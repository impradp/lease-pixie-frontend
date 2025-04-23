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
 * Props for the PortfolioVendors component
 */
interface PortfolioVendorsProps {
  label?: string; // Label for the component
  selectedVendor?: DropdownOption; // Primary selected vendor
  selectedSecondaryVendor?: DropdownOption; // Secondary selected vendor
  selectedTertiaryVendor?: DropdownOption; // Tertiary selected vendor
  onVendorChange?: (vendor: DropdownOption) => void; // Callback for primary vendor change
  onSecondaryVendorChange?: (vendor: DropdownOption) => void; // Callback for secondary vendor change
  onTertiaryVendorChange?: (vendor: DropdownOption) => void; // Callback for tertiary vendor change
  vendors: DropdownOption[]; // List of available primary vendors
  secondaryVendors: DropdownOption[]; // List of available secondary vendors
  tertiaryVendors: DropdownOption[]; // List of available tertiary vendors
  onAddVendor?: (vendorData: NewVendorFormData) => void; // Callback for adding a new vendor
  showInfo?: boolean; // Whether to show info tooltips
  infoContents?: string[]; // Content for info tooltips
  vendorType?: string; // Type of vendor (e.g., Vendor)
  sectionId: string; // Unique identifier for the section
  editingSection: string | null; // Currently editing section ID
  onSectionEdit: (section: string) => void; // Callback for entering edit mode
  onSectionClose: () => void; // Callback for closing edit mode
  subLabels: string[]; // Labels for dropdowns
  refreshVendors: () => void; // Callback to refresh vendor list
}

/**
 * Renders a component for managing primary, secondary, and tertiary portfolio vendors
 * @param props - The properties for configuring the component
 * @returns JSX.Element - The rendered portfolio vendors component
 */
export const PortfolioVendors: React.FC<PortfolioVendorsProps> = ({
  label = "",
  selectedVendor,
  selectedSecondaryVendor,
  selectedTertiaryVendor,
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
}) => {
  const [showNewVendorModal, setShowNewVendorModal] = useState(false); // Controls new vendor modal visibility
  const [isEditMode, setIsEditMode] = useState(false); // Tracks edit mode state
  const [editedVendor, setEditedVendor] = useState(selectedVendor); // Tracks edited primary vendor
  const [editedSecondaryVendor, setEditedSecondaryVendor] = useState(
    selectedSecondaryVendor
  ); // Tracks edited secondary vendor
  const [editedTertiaryVendor, setEditedTertiaryVendor] = useState(
    selectedTertiaryVendor
  ); // Tracks edited tertiary vendor
  const [originalVendor, setOriginalVendor] = useState(selectedVendor); // Stores original primary vendor
  const [originalSecondaryVendor, setOriginalSecondaryVendor] = useState(
    selectedSecondaryVendor
  ); // Stores original secondary vendor
  const [originalTertiaryVendor, setOriginalTertiaryVendor] = useState(
    selectedTertiaryVendor
  ); // Stores original tertiary vendor

  const isEditing = isEditMode; // Alias for edit mode state

  /**
   * Syncs original and edited vendor selections with props
   */
  useEffect(() => {
    // Updates state when selected vendors change
    setOriginalVendor(selectedVendor);
    setOriginalSecondaryVendor(selectedSecondaryVendor);
    setOriginalTertiaryVendor(selectedTertiaryVendor);
    setEditedVendor(selectedVendor);
    setEditedSecondaryVendor(selectedSecondaryVendor);
    setEditedTertiaryVendor(selectedTertiaryVendor);
  }, [selectedVendor, selectedSecondaryVendor, selectedTertiaryVendor]);

  /**
   * Manages body overflow based on modal visibility
   */
  useEffect(() => {
    // Locks/unlocks scroll when modal is open
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
   * Handles adding a new vendor via API
   * @param userData - Data for the new vendor
   * @param setLoading - Function to toggle loading state
   */
  const handleAddVendor = async (
    userData: NewVendorFormData,
    setLoading: (loading: boolean) => void
  ) => {
    // Submits new vendor data and refreshes list
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await portfolioService.addVendor(userData);
      if (response?.status === "SUCCESS") {
        setShowNewVendorModal(false);
        handleInfo({ code: 100510 });
        refreshVendors();
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
  const handleCloseVendorModal = () => {
    // Hides the new vendor modal
    setShowNewVendorModal(false);
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
    // Exits edit mode and reverts vendor selections
    setIsEditMode(false);
    setEditedVendor(originalVendor);
    setEditedSecondaryVendor(originalSecondaryVendor);
    setEditedTertiaryVendor(originalTertiaryVendor);
    onSectionClose();
  };

  /**
   * Saves changes and exits edit mode
   */
  const handleUpdate = () => {
    // Applies vendor changes and exits edit mode
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
    onSectionClose();
  };

  /**
   * Updates the edited primary vendor
   * @param vendor - The selected vendor
   */
  const handleVendorChange = (vendor: DropdownOption) => {
    // Updates primary vendor selection
    setEditedVendor(vendor);
  };

  /**
   * Updates the edited secondary vendor
   * @param vendor - The selected vendor
   */
  const handleSecondaryVendorChange = (vendor: DropdownOption) => {
    // Updates secondary vendor selection
    setEditedSecondaryVendor(vendor);
  };

  /**
   * Updates the edited tertiary vendor
   * @param vendor - The selected vendor
   */
  const handleTertiaryVendorChange = (vendor: DropdownOption) => {
    // Updates tertiary vendor selection
    setEditedTertiaryVendor(vendor);
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
          options={vendors}
          value={editedVendor?.value}
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
            onClick={() => setShowNewVendorModal(true)}
          />
        )}
        <CustomDropdown
          options={secondaryVendors}
          value={editedSecondaryVendor?.value}
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
            onClick={() => setShowNewVendorModal(true)}
          />
        )}
        <CustomDropdown
          options={tertiaryVendors}
          value={editedTertiaryVendor?.value}
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
              onClick={() => setShowNewVendorModal(true)}
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
