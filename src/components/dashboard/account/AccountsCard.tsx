"use client";

import React, { useState, useEffect, useCallback } from "react";

import toastr from "@/lib/func/toastr";
import { Account } from "@/types/Account";
import { defaultData } from "@/data/accounts";
import handleError from "@/lib/utils/errorHandler";
import { accountService } from "@/lib/services/account";
import CompanyInfo from "@/components/dashboard/CompanyInfo";
import AccountForm from "@/components/dashboard/account/AccountForm";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
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
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showPreConfirmationDialog, setShowPreConfirmationDialog] =
    useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [displayEditFeature, setDisplayEditFeature] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account>(defaultData);

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
  const fetchAccounts = useCallback(async () => {
    isSubmitting(true);
    setSearchTerm("");
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
  }, [isSubmitting]);

  // Initial data fetch on component mount
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Handle add account button click
  const handleAccountAdd = () => {
    setShowPreConfirmationDialog(true);
  };

  // Manage body overflow when modal is open
  useEffect(() => {
    document.body.style.overflow = showAccountForm ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showAccountForm]);

  const handleAddAccount = async (userData: Account) => {
    try {
      setShowAccountForm(false);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await accountService.create(userData);

      if (response?.status === "SUCCESS") {
        toastr({
          message: "Account created successfully.",
          toastrType: "success",
        });
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

  const handleEditAccount = async (accountId: string, userData: Account) => {
    try {
      setShowAccountForm(false);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await accountService.update(accountId, userData);

      if (response?.status === "SUCCESS") {
        toastr({
          message: "Account updated successfully.",
          toastrType: "success",
        });
        fetchAccounts();
      } else {
        handleError({
          message: "Account update failed.",
        });
      }
    } catch (error) {
      handleError({
        message: "Exception occurred while updating account.",
        error,
      });
    }
  };

  const handleToggleAccess = async (
    accountId: string,
    isLocked: boolean
  ): Promise<boolean> => {
    // Store previous accounts state for reversion
    const previousAccounts = [...accounts];

    try {
      // Optimistically update accounts state
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === accountId ? { ...acc, isAccessLocked: isLocked } : acc
        )
      );

      const account = accounts.find((acc) => acc.id === accountId);
      if (!account) {
        throw new Error("Account not found");
      }

      const response = await accountService.updateAccess(accountId, isLocked);

      if (response?.status === "SUCCESS") {
        toastr({
          message: `Account access ${
            isLocked ? "locked" : "unlocked"
          } successfully.`,
          toastrType: "success",
        });
        return true;
      } else {
        // Revert on failure
        setAccounts(previousAccounts);
        handleError({
          message: "Failed to update account access.",
        });
        return false;
      }
    } catch (error) {
      // Revert on exception
      setAccounts(previousAccounts);
      handleError({
        message: "Exception occurred while updating account access.",
        error,
      });
      return false;
    }
  };

  const handleAddorEditAccount = async (userData: Account) => {
    if (userData?.id) {
      await handleEditAccount(userData.id, userData);
    } else {
      await handleAddAccount(userData);
    }
  };

  const handleCloseAccountModal = () => {
    setShowAccountForm(false);
    setDisplayEditFeature(false);
    setSelectedAccount(defaultData);
  };

  const handlePreConfirm = () => {
    setShowPreConfirmationDialog(false);
    setShowAccountForm(true);
  };

  const handlePreConfirmationClose = () => {
    setShowPreConfirmationDialog(false);
  };

  const onEditAccountClick = (id: string) => {
    const selectedAccount = filteredAccounts.find(
      (account) => account.id === id
    );
    if (selectedAccount) {
      setSelectedAccount(selectedAccount);
      setDisplayEditFeature(true);
      setShowAccountForm(true);
    }
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
                onToggleAccess={handleToggleAccess}
                onEditClick={onEditAccountClick}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 text-sm">
              No companies found matching your search.
            </div>
          )}
        </div>
      </div>

      {showAccountForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <AccountForm
            data={selectedAccount}
            isEditForm={displayEditFeature}
            onClose={handleCloseAccountModal}
            onSubmit={handleAddorEditAccount}
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
