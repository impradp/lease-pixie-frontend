import React, { useState, useEffect } from "react";

import { Locale } from "@/locales";
import { getMessages } from "@/locales/locale";
import PixieButton from "@/components/ui/buttons/PixieButton";
import CancelButton from "@/components/ui/buttons/CancelButton";
import { SectionHeader } from "@/components/ui/header/SectionHeader";
import { NewVendorFormData } from "@/types/vendor";
import { DropdownOption } from "@/types/user";
import { CustomDropdown } from "@/components/ui/input/CustomDropdown";
import { IconLinkButton } from "@/components/ui/buttons/IconLinkButton";
import ConfirmationDialog from "@/components/ui/dialog/ConfirmationDialog";
import { NewVendor } from "@/components/portfolio/vendor/NewVendor";

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
}

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
  onAddVendor,
  showInfo,
  infoContents = [],
  vendorType = "Vendor",
  sectionId,
  editingSection,
  onSectionEdit,
  onSectionClose,
  subLabels = ["Selected Vendor 1", "Selected Vendor 2", "Selected Vendor 3"],
}) => {
  const [showNewVendorModal, setShowNewVendorModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationContent, setConfirmationContent] = useState({
    title: "",
    message: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedVendor, setEditedVendor] = useState(selectedVendor);
  const [editedSecondaryVendor, setEditedSecondaryVendor] = useState(
    selectedSecondaryVendor
  );
  const [editedTertiaryVendor, setEditedTertiaryVendor] = useState(
    selectedTertiaryVendor
  );
  const [originalVendor, setOriginalVendor] = useState(selectedVendor);
  const [originalSecondaryVendor, setOriginalSecondaryVendor] = useState(
    selectedSecondaryVendor
  );
  const [originalTertiaryVendor, setOriginalTertiaryVendor] = useState(
    selectedTertiaryVendor
  );

  const isEditing = isEditMode;

  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);

  useEffect(() => {
    setOriginalVendor(selectedVendor);
    setOriginalSecondaryVendor(selectedSecondaryVendor);
    setOriginalTertiaryVendor(selectedTertiaryVendor);
    setEditedVendor(selectedVendor);
    setEditedSecondaryVendor(selectedSecondaryVendor);
    setEditedTertiaryVendor(selectedTertiaryVendor);
  }, [selectedVendor, selectedSecondaryVendor, selectedTertiaryVendor]);

  useEffect(() => {
    if (showNewVendorModal || showConfirmation) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showNewVendorModal, showConfirmation]);

  const handleAddVendor = (vendorData: NewVendorFormData) => {
    if (onAddVendor) {
      onAddVendor(vendorData);
    }
    setShowNewVendorModal(false);
    setConfirmationContent({
      title: messages?.portfolio?.vendor?.confirmModal?.title,
      message: messages?.portfolio?.vendor?.confirmModal?.message,
    });
    setShowConfirmation(true);
  };

  const handleCloseVendorModal = () => {
    setShowNewVendorModal(false);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  const handleEdit = () => {
    if (editingSection === null || editingSection === sectionId) {
      setIsEditMode(true);
      onSectionEdit(sectionId);
    }
  };

  const handleTextClose = () => {
    setIsEditMode(false);
    setEditedVendor(originalVendor);
    setEditedSecondaryVendor(originalSecondaryVendor);
    setEditedTertiaryVendor(originalTertiaryVendor);
    onSectionClose();
  };

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

  const handleVendorChange = (vendor: DropdownOption) => {
    setEditedVendor(vendor);
  };

  const handleSecondaryVendorChange = (vendor: DropdownOption) => {
    setEditedSecondaryVendor(vendor);
  };

  const handleTertiaryVendorChange = (vendor: DropdownOption) => {
    setEditedTertiaryVendor(vendor);
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
              <CancelButton onClick={handleTextClose} />
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

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
        title={confirmationContent.title}
        message={confirmationContent.message}
      />
    </>
  );
};
