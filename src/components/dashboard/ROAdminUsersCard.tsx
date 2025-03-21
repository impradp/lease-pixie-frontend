"use client";

import React, { useState, useEffect } from "react";

import { NewUserFormData } from "@/types/user";
import ROAdminUsersCardContent from "./ROAdminUsersCardContent";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import { sampleReadOnlyAdminUsers } from "@/data/readOnlyAdminUsers";
import { NewReadOnlyAdminUser } from "@/components/dashboard/NewReadOnlyAdminUser";
import ConfirmationDialog from "@/components/ui/dialog/ConfirmationDialog";

interface ROAdminUsersCardProps {
  onAddUser?: (userData: NewUserFormData) => void;
}

const ROAdminUsersCard: React.FC<ROAdminUsersCardProps> = ({ onAddUser }) => {
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationContent, setConfirmationContent] = useState({
    title: "",
    message: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const onSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const filteredAdminUsers = sampleReadOnlyAdminUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onAddClick = () => {
    setShowNewUserModal(true);
  };

  const handleDelete = () => {
    //TODO: Handle proper deletion
  };

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
      title: "Read-Only Admin Added",
      message: "Read-Only Admin User successfully added.",
    });
    setShowConfirmation(true);
  };

  const handleCloseUserModal = () => {
    setShowNewUserModal(false);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="relative w-[408px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
        <div className="w-full">
          <PixieCardHeader
            label={"Read-Only Admin Users"}
            isEditable={true}
            onSearchChange={onSearchChange}
            showSearchFeat={true}
            showAddIcon={true}
            showSearchIcon={true}
            onAddClick={onAddClick}
          />
        </div>
        <div className="w-full inline-flex flex-col justify-start items-center gap-3">
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
        <div className="fixed inset-0 z-50">
          <div className="relative z-50">
            <NewReadOnlyAdminUser
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

export default ROAdminUsersCard;
