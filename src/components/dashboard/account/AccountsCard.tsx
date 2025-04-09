"use client";

import React, { useState, useEffect } from "react";
import toastr from "@/lib/func/toastr";
import { Account } from "@/types/Account";
import { accountService } from "@/lib/services/account";
import CompanyInfo from "@/components/dashboard/CompanyInfo";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import { NewAccount } from "@/components/dashboard/account/NewAccount";
import PreConfirmationDialog from "@/components/ui/dialog/PreConfirmationDialog";
import handleError from "@/lib/utils/errorHandler";

/**
 * Props for the AccountsCard component
 */
interface AccountsCardProps {
  isEditable?: boolean; // Whether the card is editable (default: false)
  onSearchChange?: (value: string) => void; // Callback for search input changes
  accountData: Account[]; // Optional account data to display
  refreshAccounts?: () => void; // Function to refresh accounts data (corrected type)
}

/**
 * Renders a card displaying a searchable list of company accounts with add functionality
 * @param props - The properties for configuring the card
 * @returns JSX.Element - The rendered accounts card
 */
const AccountsCard: React.FC<AccountsCardProps> = ({
  isEditable = false,
  onSearchChange,
  accountData = [],
  refreshAccounts,
}) => {
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [isAccessLocked, setIsAccessLocked] = useState(false);
  const [showPreConfirmationDialog, setShowPreConfirmationDialog] =
    useState(false);

  // Handle search input changes and filter companies
  const handleSearchChange = (value: string) => {
    onSearchChange?.(value);
  };

  // Handle add account button click
  const handleAccountAdd = () => {
    setShowPreConfirmationDialog(true);
  };

  // Manage body overflow when modal is open
  useEffect(() => {
    document.body.style.overflow = showNewAccountModal ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset"; // Cleanup on unmount
    };
  }, [showNewAccountModal]);

  // Handle new account submission
  const handleAddAccount = async (userData: Account) => {
    try {
      setShowNewAccountModal(false);
      await new Promise((resolve) => requestAnimationFrame(resolve)); // Simulate async delay
      const response = await accountService.create(userData);

      if (response?.status === "SUCCESS") {
        toastr({
          message: "Account created successfully.",
          toastrType: "success",
        });

        // Refresh accounts after successful creation
        if (refreshAccounts) {
          refreshAccounts();
        }
      } else {
        handleError({
          message: "Account creation failed.",
        });
      }
    } catch (error) {
      handleError({
        message: "Exception occurred while creating account.",
        error,
      });
    }
  };

  // Close the new account modal
  const handleCloseAccountModal = () => {
    setShowNewAccountModal(false);
  };

  // Confirm pre-confirmation dialog
  const handlePreConfirm = () => {
    setShowPreConfirmationDialog(false);
    setShowNewAccountModal(true);
  };

  // Close pre-confirmation dialog
  const handlePreConfirmationClose = () => {
    setShowPreConfirmationDialog(false);
  };

  return (
    <>
      <div className="relative w-[408px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
        <PixieCardHeader
          label="Accounts"
          isEditable={isEditable}
          onSearchChange={handleSearchChange}
          showSearchFeat={true}
          showSearchIcon={true}
          showAddIcon={true}
          onAddClick={handleAccountAdd}
          showRefreshIcon={true}
          onRefreshClick={refreshAccounts}
        />
        <div className="flex flex-col gap-3">
          {accountData.length > 0 ? (
            accountData.map((company, index) => (
              <CompanyInfo
                key={index}
                details={company}
                onToggleAccess={() => setIsAccessLocked(!isAccessLocked)}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 text-sm">
              No companies found matching your search.
            </div>
          )}
        </div>
      </div>

      {showNewAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <NewAccount
            onClose={handleCloseAccountModal}
            onSubmit={handleAddAccount}
          />
        </div>
      )}

      <PreConfirmationDialog
        isOpen={showPreConfirmationDialog}
        onClose={handlePreConfirmationClose}
        onConfirm={handlePreConfirm}
        title="Create Account"
        message="Create a billing account. This action will add an Account user to the platform."
        confirmButtonLabel="Create Billing Account"
      />
    </>
  );
};

export default AccountsCard;
