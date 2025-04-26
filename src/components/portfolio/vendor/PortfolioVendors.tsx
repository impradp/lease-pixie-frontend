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
}) => {
  const [showNewVendorModal, setShowNewVendorModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedVendor, setEditedVendor] =
    useState<DropdownOption>(selectedVendor);
  const [editedSecondaryVendor, setEditedSecondaryVendor] =
    useState<DropdownOption>(selectedSecondaryVendor);
  const [editedTertiaryVendor, setEditedTertiaryVendor] =
    useState<DropdownOption>(selectedTertiaryVendor);
  const [originalVendor, setOriginalVendor] =
    useState<DropdownOption>(selectedVendor);
  const [originalSecondaryVendor, setOriginalSecondaryVendor] =
    useState<DropdownOption>(selectedSecondaryVendor);
  const [originalTertiaryVendor, setOriginalTertiaryVendor] =
    useState<DropdownOption>(selectedTertiaryVendor);

  const isEditing = isEditMode;

  /**
   * Syncs internal state with props and validates selected vendors against options
   */
  useEffect(() => {
    // Validate and sync selectedVendor
    const validSelectedVendor =
      vendors.find((vendor) => vendor.value === selectedVendor.value) ||
      selectedVendor;
    setOriginalVendor(validSelectedVendor);
    setEditedVendor(validSelectedVendor);

    // Validate and sync selectedSecondaryVendor
    const validSelectedSecondaryVendor =
      secondaryVendors.find(
        (vendor) => vendor.value === selectedSecondaryVendor.value
      ) || selectedSecondaryVendor;
    setOriginalSecondaryVendor(validSelectedSecondaryVendor);
    setEditedSecondaryVendor(validSelectedSecondaryVendor);

    // Validate and sync selectedTertiaryVendor
    const validSelectedTertiaryVendor =
      tertiaryVendors.find(
        (vendor) => vendor.value === selectedTertiaryVendor.value
      ) || selectedTertiaryVendor;
    setOriginalTertiaryVendor(validSelectedTertiaryVendor);
    setEditedTertiaryVendor(validSelectedTertiaryVendor);
  }, [
    selectedVendor,
    selectedSecondaryVendor,
    selectedTertiaryVendor,
    vendors,
    secondaryVendors,
    tertiaryVendors,
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
    setShowNewVendorModal(false);
  };

  /**
   * Enters edit mode for the section
   */
  const handleEdit = () => {
    if (editingSection === null || editingSection === sectionId) {
      setIsEditMode(true);
      onSectionEdit(sectionId);
    }
  };

  /**
   * Cancels edit mode and reverts changes
   */
  const handleTextClose = () => {
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
    setEditedVendor(vendor);
    console.log("Updated editedVendor:", vendor);
  };

  /**
   * Updates the edited secondary vendor
   * @param vendor - The selected vendor
   */
  const handleSecondaryVendorChange = (vendor: DropdownOption) => {
    setEditedSecondaryVendor(vendor);
    console.log("Updated editedSecondaryVendor:", vendor);
  };

  /**
   * Updates the edited tertiary vendor
   * @param vendor - The selected vendor
   */
  const handleTertiaryVendorChange = (vendor: DropdownOption) => {
    setEditedTertiaryVendor(vendor);
    console.log("Updated editedTertiaryVendor:", vendor);
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
          options={vendors}
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
            onClick={() => setShowNewVendorModal(true)}
          />
        )}
        <CustomDropdown
          options={secondaryVendors}
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
            onClick={() => setShowNewVendorModal(true)}
          />
        )}
        <CustomDropdown
          options={tertiaryVendors}
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
