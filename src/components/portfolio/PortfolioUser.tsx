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

interface PortfolioUserProps {
  label?: string;
  selectedUser?: DropdownOption;
  onUserChange?: (user: DropdownOption) => void;
  onEdit?: () => void;
  isExistingPortfolio?: boolean;
  users: DropdownOption[];
  onAddUser?: (userData: NewUserFormData) => void;
  onAddVendor?: (vendorData: NewVendorFormData) => void;
  showInfo?: boolean;
  infoContent?: string;
  userType?: string;
}

export const PortfolioUser: React.FC<PortfolioUserProps> = ({
  label = "",
  selectedUser,
  onUserChange,
  onEdit,
  isExistingPortfolio = false,
  users,
  onAddUser,
  onAddVendor,
  showInfo,
  infoContent,
  userType = "Portfolio User",
}) => {
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showNewVendorModal, setShowNewVendorModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationContent, setConfirmationContent] = useState({
    title: "",
    message: "",
  });
  const isEditing = !isExistingPortfolio || !!onUserChange;

  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);

  // Add useEffect to handle body scroll
  useEffect(() => {
    if (showNewUserModal || showNewVendorModal || showConfirmation) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function
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

  return (
    <>
      <div className="bg-card-open-fill rounded-xl p-6 flex flex-col gap-4">
        <SectionHeader
          title={label}
          onEdit={onEdit}
          showEditButton={isExistingPortfolio}
          showInfo={showInfo}
          infoContent={infoContent}
        />
        <CustomDropdown
          options={users}
          value={selectedUser?.value}
          onChange={onUserChange}
          readOnly={isExistingPortfolio && !onUserChange}
          isEditing={isEditing}
          labelSuffix={userType}
        />
        {isEditing && (
          <IconLinkButton
            label={`Add ${userType}`}
            onClick={() =>
              userType === messages?.portfolio?.user?.commonName
                ? setShowNewUserModal(true)
                : setShowNewVendorModal(true)
            }
          />
        )}
      </div>

      {/* Modal overlays */}
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
