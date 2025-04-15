"use client";

import React, { useState, useEffect, useCallback } from "react";

import { userService } from "@/lib/services/user";
import handleInfo from "@/lib/utils/errorHandler";
import { ReadOnlyAdminUser } from "@/types/ReadOnlyAdminUser";
import { defaultReadOnlyAdminUser } from "@/data/readOnlyAdminUser";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import ReadOnlyAdminUserForm from "@/components/dashboard/ReadOnlyAdminUserForm";
import ROAdminUsersCardContent from "@/components/dashboard/ROAdminUsersCardContent";

/**
 * Props for the ROAdminUsersCard component
 */
interface ROAdminUsersCardProps {
  isEditable?: boolean; // Whether the card is editable (default: false)
  isSubmitting: (value: boolean) => void;
}

/**
 * Renders a card displaying a searchable list of read-only admin users with add/delete functionality
 * @param props - The properties for configuring the card
 * @returns JSX.Element - The rendered read-only admin users card
 */
const ROAdminUsersCard: React.FC<ROAdminUsersCardProps> = ({
  isEditable = false,
  isSubmitting,
}) => {
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [readOnlyAdminUsers, setReadOnlyAdminUsers] = useState<
    ReadOnlyAdminUser[]
  >([]);
  const [displayEditFeature, setDisplayEditFeature] = useState(false);
  const [selectedReadOnlyAdminUser, setSelectedReadOnlyAdminUser] =
    useState<ReadOnlyAdminUser>(defaultReadOnlyAdminUser);
  const [isRefreshClicked, setIsRefreshClicked] = useState(false);

  // Handle refresh button click
  const onRefreshClick = () => {
    setIsRefreshClicked(true);
    setSearchTerm("");
    fetchROAdminUsers();
    setTimeout(() => setIsRefreshClicked(false), 500); // Reset after 500ms
  };

  // Handle search input changes
  const onSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Handle add button click
  const onAddClick = () => {
    setShowNewUserModal(true);
  };

  // Handle delete action (placeholder for API call)
  const handleDelete = async (id: string) => {
    try {
      isSubmitting(true);
      setShowNewUserModal(false);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await userService.deleteROAdminUser(id);

      if (response?.status === "SUCCESS") {
        handleInfo({ code: 100208 });
        fetchROAdminUsers();
      } else {
        handleInfo({ code: 100209 });
      }
    } catch (err) {
      handleInfo({ code: 100209, error: err });
    } finally {
      isSubmitting(false);
    }
  };

  // Filter users based on search term
  const filteredAdminUsers = readOnlyAdminUsers.filter((user) =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manage body overflow when modals are open
  useEffect(() => {
    document.body.style.overflow = showNewUserModal ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset"; // Cleanup on unmount
    };
  }, [showNewUserModal]);

  // Fetch read-only admin users
  const fetchROAdminUsers = useCallback(async () => {
    setSearchTerm("");
    try {
      const response = await userService.fetchROAdminUsers();
      if (response.status === "SUCCESS") {
        setReadOnlyAdminUsers(response?.data);
      } else {
        handleInfo({ code: 100206 });
      }
    } catch (err) {
      handleInfo({ code: 100207, error: err });
    }
  }, [isSubmitting]);

  //Handles the read-only admin user form submission
  const handleAddUser = async (userData: ReadOnlyAdminUser) => {
    try {
      isSubmitting(true);
      setShowNewUserModal(false);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await userService.createROAdminUser(userData);

      if (response?.status === "SUCCESS") {
        handleInfo({ code: 100203 });
        fetchROAdminUsers();
      } else {
        handleInfo({ code: 100204 });
      }
    } catch (err) {
      handleInfo({ code: 100205, error: err });
    } finally {
      isSubmitting(false);
    }
  };

  // Close the new user modal
  const handleConfirmationClose = () => {
    setShowNewUserModal(false);
    setDisplayEditFeature(false);
    setSelectedReadOnlyAdminUser(defaultReadOnlyAdminUser);
  };

  return (
    <>
      <div className="relative w-[408px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
        <PixieCardHeader
          label="Read-Only Admin Users"
          isEditable={isEditable}
          onSearchChange={onSearchChange}
          showSearchFeat={true}
          showAddIcon={true}
          showSearchIcon={true}
          showRefreshIcon={true}
          onAddClick={onAddClick}
          onRefreshClick={onRefreshClick}
          isRefreshClicked={isRefreshClicked}
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
          <ReadOnlyAdminUserForm
            onSubmit={handleAddUser}
            data={selectedReadOnlyAdminUser}
            isEditForm={displayEditFeature}
            onClose={handleConfirmationClose}
          />
        </div>
      )}
    </>
  );
};

export default ROAdminUsersCard;
