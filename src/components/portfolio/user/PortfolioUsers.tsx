"use client";

import React, { useState, useEffect } from "react";
import handleInfo from "@/lib/utils/errorHandler";
import { accountService } from "@/lib/services/account";
import { emptySecondaryUserOption } from "@/data/users";
import LinkButton from "@/components/ui/buttons/LinkButton";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { NewUserFormData, DropdownOption } from "@/types/user";
import { SectionHeader } from "@/components/ui/header/SectionHeader";
import { CustomDropdown } from "@/components/ui/input/CustomDropdown";
import { IconLinkButton } from "@/components/ui/buttons/IconLinkButton";
import NewPortfolioUser from "@/components/portfolio/user/NewPortfolioUser";

/**
 * Props for the PortfolioUsers component
 */
interface PortfolioUsersProps {
  label?: string;
  selectedUser?: DropdownOption;
  selectedSecondaryUser?: DropdownOption;
  onUserChange?: (user: DropdownOption) => void;
  onSecondaryUserChange?: (user: DropdownOption) => void;
  users: DropdownOption[];
  secondaryUsers: DropdownOption[];
  showInfo?: boolean;
  infoContent?: string;
  userType?: string;
  sectionId: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
  subLabels: string[];
  isSecondaryUserLocked?: boolean;
  isLoading?: boolean;
  refreshUserList: () => void;
}

/**
 * Renders a component for managing primary and secondary portfolio users
 * @param props - The properties for configuring the component
 * @returns JSX.Element - The rendered portfolio users component
 */
export const PortfolioUsers: React.FC<PortfolioUsersProps> = ({
  label = "",
  selectedUser = { value: "", label: "" },
  selectedSecondaryUser = { value: "", label: "" },
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
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<DropdownOption>(selectedUser);
  const [editedSecondaryUser, setEditedSecondaryUser] =
    useState<DropdownOption>(selectedSecondaryUser);
  const [originalUser, setOriginalUser] =
    useState<DropdownOption>(selectedUser);
  const [originalSecondaryUser, setOriginalSecondaryUser] =
    useState<DropdownOption>(selectedSecondaryUser);
  const [secondarySampleUsers, setSecondarySampleUsers] =
    useState<DropdownOption[]>(secondaryUsers);

  const isEditing = isEditMode;
  const isSecondaryUnlocked =
    !isSecondaryUserLocked || (editedUser && editedUser.value !== "");

  /**
   * Syncs state with props when selected users change
   */
  useEffect(() => {
    setOriginalUser(selectedUser);
    setOriginalSecondaryUser(selectedSecondaryUser);
    setEditedUser(selectedUser);
    setEditedSecondaryUser(emptySecondaryUserOption);
    setSecondarySampleUsers(
      secondaryUsers.filter((opt) => opt.value !== selectedUser.value)
    );
  }, [selectedUser]);

  /**
   * Manages body overflow for modal
   */
  useEffect(() => {
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
   * Adds a new user via API
   * @param userData - New user form data
   * @param setLoading - Function to toggle loading state
   */
  const handleAddUser = async (
    userData: NewUserFormData,
    setLoading: (loading: boolean) => void
  ) => {
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await accountService.addPortfolioUsers(userData);
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
    setShowNewUserModal(false);
  };

  /**
   * Enters edit mode
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
    setEditedUser(originalUser);
    setEditedSecondaryUser(originalSecondaryUser);
    onSectionClose();
  };

  /**
   * Saves changes and exits edit mode
   */
  const handleUpdate = () => {
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
   * Updates primary user and filters secondary users
   * @param user - Selected primary user
   */
  const handleUserChange = (user: DropdownOption) => {
    setEditedUser(user);
    setSecondarySampleUsers(
      secondaryUsers.filter((opt) => opt.value !== user.value)
    );
  };

  /**
   * Updates secondary user
   * @param user - Selected secondary user
   */
  const handleSecondaryUserChange = (user: DropdownOption) => {
    setEditedSecondaryUser(user);
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
          value={editedUser?.value || ""}
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
          value={editedSecondaryUser?.value || ""}
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
