"use client";

import React, { useState, useEffect } from "react";
import handleInfo from "@/lib/utils/errorHandler";

import { portfolioService } from "@/lib/services/portfolio";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { NewUserFormData, DropdownOption } from "@/types/user";
import LinkButton from "@/components/ui/buttons/LinkButton";
import { SectionHeader } from "@/components/ui/header/SectionHeader";
import { CustomDropdown } from "@/components/ui/input/CustomDropdown";
import { IconLinkButton } from "@/components/ui/buttons/IconLinkButton";
import NewPortfolioUser from "@/components/portfolio/user/NewPortfolioUser";

/**
 * Props for the PortfolioUsers component
 */
interface PortfolioUsersProps {
  label?: string; // Label for the component
  selectedUser?: DropdownOption; // Primary selected user
  selectedSecondaryUser?: DropdownOption; // Secondary selected user
  onUserChange?: (user: DropdownOption) => void; // Callback for primary user change
  onSecondaryUserChange?: (user: DropdownOption) => void; // Callback for secondary user change
  users: DropdownOption[]; // List of available primary users
  secondaryUsers: DropdownOption[]; // List of available secondary users
  showInfo?: boolean; // Whether to show info tooltip
  infoContent?: string; // Content for info tooltip
  userType?: string; // Type of user (e.g., Portfolio User)
  sectionId: string; // Unique identifier for the section
  editingSection: string | null; // Currently editing section ID
  onSectionEdit: (section: string) => void; // Callback for entering edit mode
  onSectionClose: () => void; // Callback for closing edit mode
  subLabels: string[]; // Labels for dropdowns
  isSecondaryUserLocked?: boolean; // Whether secondary user dropdown is locked
  isLoading?: boolean; // Loading state for the component
  refreshUserList: () => void; // Callback to refresh user list
}

/**
 * Renders a component for managing primary and secondary portfolio users
 * @param props - The properties for configuring the component
 * @returns JSX.Element - The rendered portfolio users component
 */
export const PortfolioUsers: React.FC<PortfolioUsersProps> = ({
  label = "",
  selectedUser,
  selectedSecondaryUser,
  onUserChange,
  onSecondaryUserChange,
  users,
  secondaryUsers,
  showInfo,
  infoContent,
  userType = "Portfolio User",
  sectionId,
  editingSection,
  onSectionEdit,
  onSectionClose,
  subLabels = ["Selected User 1", "Selected User 2"],
  isSecondaryUserLocked = false,
  isLoading = false,
  refreshUserList,
}) => {
  const [showNewUserModal, setShowNewUserModal] = useState(false); // Controls new user modal visibility
  const [isEditMode, setIsEditMode] = useState(false); // Tracks edit mode state
  const [editedUser, setEditedUser] = useState(selectedUser); // Tracks edited primary user
  const [editedSecondaryUser, setEditedSecondaryUser] = useState(
    selectedSecondaryUser
  ); // Tracks edited secondary user
  const [originalUser, setOriginalUser] = useState(selectedUser); // Stores original primary user
  const [originalSecondaryUser, setOriginalSecondaryUser] = useState(
    selectedSecondaryUser
  ); // Stores original secondary user
  const [secondarySampleUsers, setSecondarySampleUsers] =
    useState(secondaryUsers); // Filtered secondary users list

  const isEditing = isEditMode; // Alias for edit mode state
  const isSecondaryUnlocked =
    !isSecondaryUserLocked || (editedUser && editedUser.value !== ""); // Determines if secondary dropdown is unlocked

  /**
   * Syncs original and edited user selections with props
   */
  useEffect(() => {
    // Updates state when selected users change
    setOriginalUser(selectedUser);
    setOriginalSecondaryUser(selectedSecondaryUser);
    setEditedUser(selectedUser);
    setEditedSecondaryUser(selectedSecondaryUser);
  }, [selectedUser, selectedSecondaryUser]);

  /**
   * Manages body overflow based on modal visibility
   */
  useEffect(() => {
    // Locks/unlocks scroll when modal is open
    if (showNewUserModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showNewUserModal]);

  /**
   * Handles adding a new user via API
   * @param userData - Data for the new user
   * @param setLoading - Function to toggle loading state
   */
  const handleAddUser = async (
    userData: NewUserFormData,
    setLoading: (loading: boolean) => void
  ) => {
    // Submits new user data and refreshes list
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await portfolioService.addUser(userData);
      if (response?.status === "SUCCESS") {
        setShowNewUserModal(false);
        handleInfo({ code: 100507 });
        refreshUserList();
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
   * Closes the new user modal
   */
  const handleCloseUserModal = () => {
    // Hides the new user modal
    setShowNewUserModal(false);
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
    // Exits edit mode and reverts selections
    setIsEditMode(false);
    setEditedUser(originalUser);
    setEditedSecondaryUser(originalSecondaryUser);
    onSectionClose();
  };

  /**
   * Saves changes and exits edit mode
   */
  const handleUpdate = () => {
    // Applies changes and exits edit mode
    setIsEditMode(false);
    if (onUserChange && editedUser) {
      onUserChange(editedUser);
    }
    if (onSecondaryUserChange && editedSecondaryUser) {
      onSecondaryUserChange(editedSecondaryUser);
    }
    onSectionClose();
  };

  /**
   * Updates the edited primary user and filters secondary users
   * @param user - The selected user
   */
  const handleUserChange = (user: DropdownOption) => {
    // Updates primary user and adjusts secondary options
    setEditedUser(user);
    setSecondarySampleUsers(
      secondaryUsers.filter((opt) => opt.value !== user.value)
    );
  };

  /**
   * Updates the edited secondary user
   * @param user - The selected user
   */
  const handleSecondaryUserChange = (user: DropdownOption) => {
    // Updates secondary user selection
    setEditedSecondaryUser(user);
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
          label={subLabels[0]}
          isRequired={true}
        />
        {isEditMode && (
          <IconLinkButton
            label={`Add ${userType}`}
            onClick={() => setShowNewUserModal(true)}
          />
        )}
        <CustomDropdown
          options={secondarySampleUsers}
          value={editedSecondaryUser?.value}
          onChange={isEditing ? handleSecondaryUserChange : undefined}
          readOnly={!isEditing}
          isEditing={isEditing}
          label={subLabels[1]}
          isLocked={!isSecondaryUnlocked}
          lockMessage="Secondary user not active"
        />
        {isEditMode && (
          <>
            <IconLinkButton
              label={`Add ${userType}`}
              onClick={() => setShowNewUserModal(true)}
            />
            <div className="flex flex-col gap-3">
              <PixieButton
                label="Update"
                disabled={false}
                onClick={handleUpdate}
                className="w-full"
                isLoading={isLoading}
              />
              <div className="flex justify-center">
                <LinkButton onClick={handleTextClose} />
              </div>
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
    </>
  );
};
