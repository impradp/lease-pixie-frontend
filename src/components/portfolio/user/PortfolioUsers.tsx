import React, { useState, useEffect } from "react";
import { Locale } from "@/locales";
import { getMessages } from "@/locales/loader";
import PixieButton from "@/components/ui/buttons/PixieButton";
import CancelButton from "@/components/ui/buttons/CancelButton";
import { SectionHeader } from "@/components/ui/header/SectionHeader";
import { NewUserFormData, DropdownOption } from "@/types/user";
import { CustomDropdown } from "@/components/ui/input/CustomDropdown";
import { IconLinkButton } from "@/components/ui/buttons/IconLinkButton";
import ConfirmationDialog from "@/components/ui/dialog/ConfirmationDialog";
import { NewPortfolioUser } from "@/components/portfolio/user/NewPortfolioUser";

interface PortfolioUsersProps {
  label?: string;
  selectedUser?: DropdownOption;
  selectedSecondaryUser?: DropdownOption;
  onUserChange?: (user: DropdownOption) => void;
  onSecondaryUserChange?: (user: DropdownOption) => void;
  users: DropdownOption[];
  secondaryUsers: DropdownOption[];
  onAddUser?: (userData: NewUserFormData) => void;
  showInfo?: boolean;
  infoContent?: string;
  userType?: string;
  sectionId: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
  subLabels: string[];
  isSecondaryUserLocked?: boolean;
}

export const PortfolioUsers: React.FC<PortfolioUsersProps> = ({
  label = "",
  selectedUser,
  selectedSecondaryUser,
  onUserChange,
  onSecondaryUserChange,
  users,
  secondaryUsers,
  onAddUser,
  showInfo,
  infoContent,
  userType = "Portfolio User",
  sectionId,
  editingSection,
  onSectionEdit,
  onSectionClose,
  subLabels = ["Selected User 1", "Selected User 2"],
  isSecondaryUserLocked = false,
}) => {
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationContent, setConfirmationContent] = useState({
    title: "",
    message: "",
  });
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

  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);

  // Sync original and edited values with props whenever they change
  useEffect(() => {
    setOriginalUser(selectedUser);
    setOriginalSecondaryUser(selectedSecondaryUser);
    setEditedUser(selectedUser);
    setEditedSecondaryUser(selectedSecondaryUser);
  }, [selectedUser, selectedSecondaryUser]);

  useEffect(() => {
    if (showNewUserModal || showConfirmation) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showNewUserModal, showConfirmation]);

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

  const handleCloseUserModal = () => {
    setShowNewUserModal(false);
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

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
        title={confirmationContent.title}
        message={confirmationContent.message}
      />
    </>
  );
};
