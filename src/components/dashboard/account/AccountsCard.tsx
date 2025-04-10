"use client";

import React, { useState, useEffect, useCallback } from "react";

import toastr from "@/lib/func/toastr";
import { Account } from "@/types/Account";
import handleError from "@/lib/utils/errorHandler";
import { accountService } from "@/lib/services/account";
import CompanyInfo from "@/components/dashboard/CompanyInfo";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import { NewAccount } from "@/components/dashboard/account/NewAccount";
import PreConfirmationDialog from "@/components/ui/dialog/PreConfirmationDialog";

/**
 * Props for the AccountsCard component
 */
interface AccountsCardProps {
  isEditable?: boolean; // Whether the card is editable (default: false)
  isSubmitting: (value: boolean) => void;
}

/**
 * Renders a card displaying a searchable list of company accounts with add functionality
 * @param props - The properties for configuring the card
 * @returns JSX.Element - The rendered accounts card
 */
const AccountsCard: React.FC<AccountsCardProps> = ({
  isEditable = false,
  isSubmitting,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [isAccessLocked, setIsAccessLocked] = useState(false);
  const [showPreConfirmationDialog, setShowPreConfirmationDialog] =
    useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);

  // Filter accounts based on search term
  const filterAccounts = useCallback(
    (accountsToFilter: Account[], term: string) => {
      return accountsToFilter.filter((company) =>
        [company.companyName, company.contactFirstName, company.email].some(
          (field) => field?.toLowerCase().includes(term.toLowerCase())
        )
      );
    },
    []
  );

  // Update filtered accounts whenever accounts or searchTerm changes
  useEffect(() => {
    setFilteredAccounts(filterAccounts(accounts, searchTerm));
  }, [accounts, searchTerm, filterAccounts]);

  // Fetch accounts for admin
  const fetchAccounts = async () => {
    isSubmitting(true);
    setSearchTerm(""); // Reset search term on fetch
    try {
      const response = await accountService.fetch();
      if (response.status === "SUCCESS") {
        setAccounts(response?.data);
      } else {
        handleError({ message: "Error fetching accounts." });
      }
    } catch (error) {
      handleError({
        message: "Exception occurred while fetching accounts.",
        error,
      });
    } finally {
      isSubmitting(false);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // No need to manually filter here as the useEffect will handle it
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
        fetchAccounts();
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
          onRefreshClick={fetchAccounts}
        />
        <div className="flex flex-col gap-3">
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((company, index) => (
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
