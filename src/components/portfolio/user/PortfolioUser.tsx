"use client";

import React, { useState, useEffect } from "react";
import { Locale } from "@/locales";
import { getMessages } from "@/locales/locale";
import handleInfo from "@/lib/utils/errorHandler";
import { NewVendorFormData } from "@/types/vendor";
import { portfolioService } from "@/lib/services/portfolio";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { NewUserFormData, DropdownOption } from "@/types/user";
import LinkButton from "@/components/ui/buttons/LinkButton";
import { NewVendor } from "@/components/portfolio/vendor/NewVendor";
import { SectionHeader } from "@/components/ui/header/SectionHeader";
import { CustomDropdown } from "@/components/ui/input/CustomDropdown";
import { IconLinkButton } from "@/components/ui/buttons/IconLinkButton";
import NewPortfolioUser from "@/components/portfolio/user/NewPortfolioUser";

/**
 * Props for the PortfolioUser component
 */
interface PortfolioUserProps {
  label?: string; // Label for the component
  selectedUser?: DropdownOption; // Currently selected user
  onUserChange?: (user: DropdownOption) => void; // Callback for user selection change
  users: DropdownOption[]; // List of available users
  showInfo?: boolean; // Whether to show info tooltip
  infoContent?: string; // Content for info tooltip
  userType?: string; // Type of user (e.g., Portfolio User)
  isLocked: boolean; // Whether the dropdown is locked
  lockMessage?: string; // Message to display when locked
  sectionId: string; // Unique identifier for the section
  editingSection: string | null; // Currently editing section ID
  onSectionEdit: (section: string) => void; // Callback for entering edit mode
  onSectionClose: () => void; // Callback for closing edit mode
}

/**
 * Renders a portfolio user selection component with edit functionality
 * @param props - The properties for configuring the component
 * @returns JSX.Element - The rendered portfolio user component
 */
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
  const [showNewUserModal, setShowNewUserModal] = useState(false); // State for new user modal visibility
  const [showNewVendorModal, setShowNewVendorModal] = useState(false); // State for new vendor modal visibility
  const [isEditMode, setIsEditMode] = useState(false); // State for edit mode
  const [originalUser] = useState(selectedUser); // Stores original user selection
  const [editedUser, setEditedUser] = useState(selectedUser); // Tracks edited user selection
  const isEditing = isEditMode; // Alias for edit mode state

  const [locale] = useState<Locale>("en"); // Fixed locale state
  const messages = getMessages(locale); // Localized messages

  /**
   * Manages body overflow based on modal visibility
   */
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

  /**
   * Handles adding a new user via API
   * @param userData - Data for the new user
   * @param setLoading - Function to toggle loading state
   */
  const handleAddUser = async (
    userData: NewUserFormData,
    setLoading: (loading: boolean) => void
  ) => {
    // Submits new user data to API
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await portfolioService.addUser(userData);
      if (response?.status === "SUCCESS") {
        setShowNewUserModal(false);
        handleInfo({ code: 100507 });
      } else {
        handleInfo({ code: 100508 });
      }
    } catch (err) {
      handleInfo({ code: 100509, error: err });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles adding a new vendor via API
   * @param userData - Data for the new vendor
   * @param setLoading - Function to toggle loading state
   */
  const handleAddVendor = async (
    userData: NewVendorFormData,
    setLoading: (loading: boolean) => void
  ) => {
    // Submits new vendor data to API
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await portfolioService.addVendor(userData);
      if (response?.status === "SUCCESS") {
        setShowNewVendorModal(false);
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
   * Closes the new user modal
   */
  const handleCloseUserModal = () => {
    // Hides the new user modal
    setShowNewUserModal(false);
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
    // Exits edit mode and reverts user selection
    setIsEditMode(false);
    setEditedUser(originalUser);
    onSectionClose();
  };

  /**
   * Saves changes and exits edit mode
   */
  const handleUpdate = () => {
    // Applies user selection changes and exits edit mode
    setIsEditMode(false);
    if (onUserChange && editedUser) {
      onUserChange(editedUser);
    }
    onSectionClose();
  };

  /**
   * Updates the edited user selection
   * @param user - The selected user
   */
  const handleUserChange = (user: DropdownOption) => {
    // Updates the temporary user selection
    setEditedUser(user);
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
          showInfo={showInfo}
          infoContent={infoContent}
          editDisabled={isEditDisabled}
        />
        <CustomDropdown
          options={users}
          value={editedUser?.value}
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
                onClick={handleUpdate}
                className="w-full"
              />
              <LinkButton onClick={handleTextClose} />
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
