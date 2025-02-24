import React, { useState, useEffect } from "react";
import { User } from "@/types/user";
import { NewUserFormData } from "@/types/user";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CustomDropdown } from "@/components/ui/CustomDropdown";
import { NewPortfolioUser } from "@/src/components/portfolio/NewPortfolioUser";
import { IconLinkButton } from "@/components/buttons/IconLinkButton";
import { NewVendorFormData } from "@/src/types/vendor";
import { NewVendor } from "@/components/portfolio/NewVendor";

interface PortfolioUserProps {
  label?: string;
  selectedUser?: User;
  onUserChange?: (user: User) => void;
  onEdit?: () => void;
  isExistingPortfolio?: boolean;
  users: User[];
  onAddUser?: (userData: NewUserFormData) => void;
  onAddVendor?: (vendorData: NewVendorFormData) => void;
  showInfo?: boolean;
  infoContent?: string;
  userType?: string;
}

export const PortfolioUser: React.FC<PortfolioUserProps> = ({
  label = "",
  selectedUser,
  onUserChange,
  onEdit,
  isExistingPortfolio = false,
  users,
  onAddUser,
  onAddVendor,
  showInfo,
  infoContent,
  userType = "Portfolio User",
}) => {
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showNewVendorModal, setShowNewVendorModal] = useState(false);
  const isEditing = !isExistingPortfolio || !!onUserChange;

  // Add useEffect to handle body scroll
  useEffect(() => {
    if (showNewUserModal || showNewVendorModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showNewUserModal, showNewVendorModal]);

  const handleAddUser = (userData: NewUserFormData) => {
    if (onAddUser) {
      onAddUser(userData);
    }
    setShowNewUserModal(false);
  };

  const handleAddVendor = (vendorData: NewVendorFormData) => {
    if (onAddVendor) {
      onAddVendor(vendorData);
    }
    setShowNewVendorModal(false);
  };

  const handleCloseUserModal = () => {
    setShowNewUserModal(false);
  };

  const handleCloseVendorModal = () => {
    setShowNewVendorModal(false);
  };

  return (
    <>
      <div className="bg-[#f2f2f2] rounded-xl p-6 flex flex-col gap-4">
        <SectionHeader
          title={label}
          onEdit={onEdit}
          showEditButton={isExistingPortfolio}
          showInfo={showInfo}
          infoContent={infoContent}
        />
        <CustomDropdown
          options={users}
          value={selectedUser}
          onChange={onUserChange}
          readOnly={isExistingPortfolio && !onUserChange}
          isEditing={isEditing}
          labelSuffix={userType}
        />
        {isEditing && (
          <IconLinkButton
            label={`Add ${userType}`}
            onClick={() =>
              userType === "Portfolio User"
                ? setShowNewUserModal(true)
                : setShowNewVendorModal(true)
            }
          />
        )}
      </div>

      {/* Modal overlays */}
      {showNewUserModal && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={handleCloseUserModal}
          />
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
          <div
            className="fixed inset-0 bg-black/50"
            onClick={handleCloseVendorModal}
          />
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
