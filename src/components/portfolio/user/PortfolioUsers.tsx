"use client";

import React, { useState, useEffect, useRef } from "react";
import handleInfo from "@/lib/utils/errorHandler";
import { accountService } from "@/lib/services/account";
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
  onClickUpdate?: () => void;
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
  onClickUpdate,
}) => {
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<DropdownOption>(selectedUser);
  const [editedSecondaryUser, setEditedSecondaryUser] =
    useState<DropdownOption>(selectedSecondaryUser);
  const originalUserRef = useRef<DropdownOption>(selectedUser);
  const originalSecondaryUserRef = useRef<DropdownOption>(
    selectedSecondaryUser
  );
  const [secondarySampleUsers, setSecondarySampleUsers] =
    useState<DropdownOption[]>(secondaryUsers);
  const [localUsers, setLocalUsers] = useState<DropdownOption[]>(users);
  const [localSecondaryUsers, setLocalSecondaryUsers] =
    useState<DropdownOption[]>(secondaryUsers);
  const [triggeredBy, setTriggeredBy] = useState<string | null>(null);

  const isEditing = isEditMode;
  const isSecondaryUnlocked =
    !isSecondaryUserLocked || (editedUser && editedUser.value !== "");

  /**
   * Syncs state with props when selected users change
   */
  useEffect(() => {
    setLocalUsers(users);
    setLocalSecondaryUsers(secondaryUsers);
    setSecondarySampleUsers(
      localSecondaryUsers.filter((opt) => opt.value !== editedUser.value)
    );
    if (!isEditMode) {
      setEditedUser({ ...selectedUser });
      setEditedSecondaryUser({ ...selectedSecondaryUser });
    }
  }, [users, secondaryUsers, selectedUser, selectedSecondaryUser, isEditMode]);

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

        const newUser: DropdownOption = {
          value: String(response.data.id),
          label: `${response.data.firstName} ${response.data.lastName}`,
          subLabel: response.data.email,
        };

        setLocalUsers((prev) => [...prev, newUser]);
        setLocalSecondaryUsers((prev) => [...prev, newUser]);

        if (
          triggeredBy === "primary" ||
          (triggeredBy === "secondary" && !editedUser.value)
        ) {
          setEditedUser(newUser);
          if (editedSecondaryUser.value === newUser.value) {
            setEditedSecondaryUser({ value: "", label: "", subLabel: "" });
          }
          setSecondarySampleUsers(
            localSecondaryUsers.filter((opt) => opt.value !== newUser.value)
          );
        } else if (triggeredBy === "secondary" && editedUser.value) {
          setEditedSecondaryUser(newUser);
          setSecondarySampleUsers(
            localSecondaryUsers.filter((opt) => opt.value !== editedUser.value)
          );
        }

        await refreshUserList();
      } else {
        handleInfo({ code: 100508 });
      }
    } catch (err) {
      handleInfo({ code: 100509, error: err });
    } finally {
      setLoading(false);
      setTriggeredBy(null);
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
      setEditedUser({ ...selectedUser });
      setEditedSecondaryUser({ ...selectedSecondaryUser });
      setSecondarySampleUsers(
        localSecondaryUsers.filter((opt) => opt.value !== selectedUser.value)
      );
    }
  };
  /**
   * Cancels edit mode and reverts changes
   */
  const handleTextClose = () => {
    setIsEditMode(false);
    setEditedUser({ ...originalUserRef.current });
    setEditedSecondaryUser({ ...originalSecondaryUserRef.current });
    setSecondarySampleUsers(
      localSecondaryUsers.filter(
        (opt) => opt.value !== originalUserRef.current.value
      )
    );
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
    originalUserRef.current = { ...editedUser };
    originalSecondaryUserRef.current = { ...editedSecondaryUser };
    onClickUpdate?.();
    onSectionClose();
  };

  /**
   * Updates primary user and filters secondary users
   * @param user - Selected primary user
   */
  const handleUserChange = (user: DropdownOption) => {
    setEditedUser(user);
    if (editedSecondaryUser.value === user.value) {
      setEditedSecondaryUser({ value: "", label: "", subLabel: "" });
    }
  };

  const handleSecondaryUserChange = (user: DropdownOption) => {
    setEditedSecondaryUser(user);
  };

  const handlePrimaryAddUserClick = () => {
    setShowNewUserModal(true);
    setTriggeredBy("primary");
  };

  const handleSecondaryAddUserClick = () => {
    setShowNewUserModal(true);
    setTriggeredBy("secondary");
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
          options={localUsers}
          value={
            isEditMode ? editedUser?.value || "" : selectedUser?.value || ""
          }
          onChange={isEditing ? handleUserChange : undefined}
          readOnly={!isEditing}
          isEditing={isEditing}
          label={subLabels[0]}
          isRequired={true}
        />
        {isEditMode && (
          <IconLinkButton
            label={`Add ${userType}`}
            onClick={handlePrimaryAddUserClick}
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
              onClick={handleSecondaryAddUserClick}
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
