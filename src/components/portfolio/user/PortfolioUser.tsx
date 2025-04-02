import React, { useState, useEffect } from "react";

import { Locale } from "@/locales";
import toastr from "@/lib/func/toastr";
import { getMessages } from "@/locales/locale";
import { NewVendorFormData } from "@/types/vendor";
import { portfolioService } from "@/lib/services/portfolio";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { NewUserFormData, DropdownOption } from "@/types/user";
import CancelButton from "@/components/ui/buttons/CancelButton";
import { NewVendor } from "@/components/portfolio/vendor/NewVendor";
import { SectionHeader } from "@/components/ui/header/SectionHeader";
import { CustomDropdown } from "@/components/ui/input/CustomDropdown";
import { IconLinkButton } from "@/components/ui/buttons/IconLinkButton";
import NewPortfolioUser from "@/components/portfolio/user/NewPortfolioUser";

interface PortfolioUserProps {
  label?: string;
  selectedUser?: DropdownOption;
  onUserChange?: (user: DropdownOption) => void;
  users: DropdownOption[];
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalUser] = useState(selectedUser); // Store original selection
  const [editedUser, setEditedUser] = useState(selectedUser); // Track edited selection
  const isEditing = isEditMode;

  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);

  useEffect(() => {
    if (showNewUserModal || showNewVendorModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showNewUserModal, showNewVendorModal]);

  const handleAddUser = async (
    userData: NewUserFormData,
    setLoading: (loading: boolean) => void
  ) => {
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const response = await portfolioService.addUser(userData);
      if (response?.status === "SUCCESS") {
        setShowNewUserModal(false);
        toastr({
          message: "New portfolio user added successfully.",
          toastrType: "success",
        });
      } else {
        toastr({
          message: "Error adding new portfolio user.",
          toastrType: "error",
        });
      }
    } catch {
      //TODO: Handle log
      toastr({
        message: "Exception occured adding new portfolio user.",
        toastrType: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddVendor = async (
    userData: NewVendorFormData,
    setLoading: (loading: boolean) => void
  ) => {
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const response = await portfolioService.addVendor(userData);
      if (response?.status === "SUCCESS") {
        setShowNewVendorModal(false);
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

  const handleCloseUserModal = () => {
    setShowNewUserModal(false);
  };

  const handleCloseVendorModal = () => {
    setShowNewVendorModal(false);
  };

  const handleEdit = () => {
    if (editingSection === null || editingSection === sectionId) {
      setIsEditMode(true);
      onSectionEdit(sectionId);
    }
  };

  const handleTextClose = () => {
    setIsEditMode(false);
    setEditedUser(originalUser); // Revert to original selection
    onSectionClose();
  };

  const handleUpdate = () => {
    setIsEditMode(false);
    if (onUserChange && editedUser) {
      onUserChange(editedUser); // Update parent with new selection
    }
    onSectionClose();
  };

  const handleUserChange = (user: DropdownOption) => {
    setEditedUser(user); // Update edited selection
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
          showInfo={showInfo}
          infoContent={infoContent}
          editDisabled={isEditDisabled}
        />
        <CustomDropdown
          options={users}
          value={editedUser?.value} // Use edited value
          onChange={isEditing ? handleUserChange : undefined}
          readOnly={!isEditing}
          isEditing={isEditing}
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
                onClick={handleUpdate} // Use new update handler
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
    </>
  );
};
