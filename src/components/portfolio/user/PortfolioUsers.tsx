import React, { useState, useEffect } from "react";

import toastr from "@/lib/func/toastr";
import { portfolioService } from "@/lib/services/portfolio";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { NewUserFormData, DropdownOption } from "@/types/user";
import CancelButton from "@/components/ui/buttons/CancelButton";
import { SectionHeader } from "@/components/ui/header/SectionHeader";
import { CustomDropdown } from "@/components/ui/input/CustomDropdown";
import { IconLinkButton } from "@/components/ui/buttons/IconLinkButton";
import NewPortfolioUser from "@/components/portfolio/user/NewPortfolioUser";

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
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(selectedUser);
  const [editedSecondaryUser, setEditedSecondaryUser] = useState(
    selectedSecondaryUser
  );
  const [originalUser, setOriginalUser] = useState(selectedUser);
  const [originalSecondaryUser, setOriginalSecondaryUser] = useState(
    selectedSecondaryUser
  );
  const [secondarySampleUsers, setSecondarySampleUsers] =
    useState(secondaryUsers);

  const isEditing = isEditMode;

  // Locally determine if secondary user dropdown should be unlocked
  const isSecondaryUnlocked =
    !isSecondaryUserLocked || (editedUser && editedUser.value !== "");

  // Sync original and edited values with props whenever they change
  useEffect(() => {
    setOriginalUser(selectedUser);
    setOriginalSecondaryUser(selectedSecondaryUser);
    setEditedUser(selectedUser);
    setEditedSecondaryUser(selectedSecondaryUser);
  }, [selectedUser, selectedSecondaryUser]);

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
        refreshUserList();
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

  const handleCloseUserModal = () => {
    setShowNewUserModal(false);
  };

  const handleEdit = () => {
    if (editingSection === null || editingSection === sectionId) {
      setIsEditMode(true);
      onSectionEdit(sectionId);
    }
  };

  const handleTextClose = () => {
    setIsEditMode(false);
    setEditedUser(originalUser);
    setEditedSecondaryUser(originalSecondaryUser);
    onSectionClose();
  };

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

  const handleUserChange = (user: DropdownOption) => {
    setEditedUser(user);

    setSecondarySampleUsers(
      secondaryUsers.filter((opt) => opt.value !== user.value)
    );
  };

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
    </>
  );
};
