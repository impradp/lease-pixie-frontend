import React, { useState, useEffect } from "react";
import { NewVendorFormData } from "@/types/vendor";
import { NewUserFormData, DropdownOption } from "@/types/user";
import { NewVendor } from "@/components/portfolio/NewVendor";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CustomDropdown } from "@/components/ui/CustomDropdown";
import { IconLinkButton } from "@/components/buttons/IconLinkButton";
import { NewPortfolioUser } from "@/components/portfolio/NewPortfolioUser";
import ConfirmationDialog from "@/components/popups/ConfirmationDialog";
import { getMessages } from "@/locales/loader";
import { Locale } from "@/locales";
import PixieButton from "@/components/buttons/PixieButton";
import CancelButton from "@/components/buttons/CancelButton";

interface PortfolioUserProps {
  label?: string;
  selectedUser?: DropdownOption;
  onUserChange?: (user: DropdownOption) => void;
  users: DropdownOption[];
  onAddUser?: (userData: NewUserFormData) => void;
  onAddVendor?: (vendorData: NewVendorFormData) => void;
  showInfo?: boolean;
  infoContent?: string;
  userType?: string;
  isLocked: boolean;
  lockMessage?: string;
  sectionId: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
}

export const PortfolioUser: React.FC<PortfolioUserProps> = ({
  label = "",
  selectedUser,
  onUserChange,
  users,
  onAddUser,
  onAddVendor,
  showInfo,
  infoContent,
  userType = "Portfolio User",
  isLocked = false,
  lockMessage = "Seat not active",
  sectionId,
  editingSection,
  onSectionEdit,
  onSectionClose,
}) => {
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showNewVendorModal, setShowNewVendorModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationContent, setConfirmationContent] = useState({
    title: "",
    message: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const isEditing = isEditMode; // Editing is only true when in edit mode

  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);

  useEffect(() => {
    if (showNewUserModal || showNewVendorModal || showConfirmation) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showNewUserModal, showNewVendorModal, showConfirmation]);

  const handleAddUser = (userData: NewUserFormData) => {
    if (onAddUser) {
      onAddUser(userData);
    }
    setShowNewUserModal(false);
    setConfirmationContent({
      title: messages?.portfolio?.user?.confirmModal?.title,
      message: messages?.portfolio?.user?.confirmModal?.message,
    });
    setShowConfirmation(true);
  };

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

  const handleCloseUserModal = () => {
    setShowNewUserModal(false);
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
    onSectionClose();
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
          showEditButton={!isEditMode} // Show Edit button when not in edit mode
          showTextCloseButton={isEditMode} // Show Cancel button when in edit mode
          showInfo={showInfo}
          infoContent={infoContent}
          editDisabled={isEditDisabled}
        />
        <CustomDropdown
          options={users}
          value={selectedUser?.value}
          onChange={onUserChange}
          readOnly={!isEditing} // Read-only unless in edit mode
          isEditing={isEditing} // Enable editing UI only when in edit mode
          labelSuffix={userType}
          isLocked={isLocked}
          lockMessage={lockMessage}
        />
        {isEditMode && (
          <>
            <IconLinkButton
              label={`Add ${userType}`}
              onClick={() =>
                userType === messages?.portfolio?.user?.commonName
                  ? setShowNewUserModal(true)
                  : setShowNewVendorModal(true)
              }
            />
            <div className="flex flex-col gap-3">
              <PixieButton
                label="Update"
                disabled={false}
                onClick={handleTextClose}
                className="w-full"
              />
              <CancelButton onClick={handleTextClose} />
            </div>
          </>
        )}
      </div>

      {showNewUserModal && (
        <div className="fixed inset-0 z-50">
          <div className="relative z-50">
            <NewPortfolioUser
              onClose={handleCloseUserModal}
              onSubmit={handleAddUser}
            />
          </div>
        </div>
      )}

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
