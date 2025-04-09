"use client";

import React, { useState, useEffect } from "react";
import { NewUserFormData } from "@/types/user";
import { sampleReadOnlyAdminUsers } from "@/data/readOnlyAdminUsers";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import ROAdminUsersCardContent from "./ROAdminUsersCardContent";
import NewReadOnlyAdminUser from "@/components/dashboard/NewReadOnlyAdminUser";
import ConfirmationDialog from "@/components/ui/dialog/ConfirmationDialog";

/**
 * Props for the ROAdminUsersCard component
 */
interface ROAdminUsersCardProps {
  onAddUser?: (userData: NewUserFormData) => void; // Callback for adding a new user
}

/**
 * Renders a card displaying a searchable list of read-only admin users with add/delete functionality
 * @param props - The properties for configuring the card
 * @returns JSX.Element - The rendered read-only admin users card
 */
const ROAdminUsersCard: React.FC<ROAdminUsersCardProps> = ({ onAddUser }) => {
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationContent, setConfirmationContent] = useState({
    title: "",
    message: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Handle search input changes
  const onSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Handle add button click
  const onAddClick = () => {
    setShowNewUserModal(true);
  };

  // Handle delete action (placeholder for API call)
  const handleDelete = () => {
    // TODO: Implement proper deletion logic
  };

  // Filter users based on search term
  const filteredAdminUsers = sampleReadOnlyAdminUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manage body overflow when modals are open
  useEffect(() => {
    document.body.style.overflow =
      showNewUserModal || showConfirmation ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset"; // Cleanup on unmount
    };
  }, [showNewUserModal, showConfirmation]);

  // Handle new user submission
  const handleAddUser = (userData: NewUserFormData) => {
    onAddUser?.(userData);
    setShowNewUserModal(false);
    setConfirmationContent({
      title: "Read-Only Admin Added",
      message: "Read-Only Admin User successfully added.",
    });
    setShowConfirmation(true);
  };

  // Close the new user modal
  const handleCloseUserModal = () => {
    setShowNewUserModal(false);
  };

  // Close the confirmation dialog
  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="relative w-[408px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
        <PixieCardHeader
          label="Read-Only Admin Users"
          isEditable={true}
          onSearchChange={onSearchChange}
          showSearchFeat={true}
          showAddIcon={true}
          showSearchIcon={true}
          onAddClick={onAddClick}
        />
        <div className="flex flex-col gap-3">
          {filteredAdminUsers.map((user) => (
            <ROAdminUsersCardContent
              key={user.id}
              user={user}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {showNewUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <NewReadOnlyAdminUser
            onClose={handleCloseUserModal}
            onSubmit={handleAddUser}
          />
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

export default ROAdminUsersCard;
