"use client";

import React, { useState, useEffect, useCallback } from "react";

import { Account } from "@/types/Account";
import { defaultData } from "@/data/accounts";
import handleInfo from "@/lib/utils/errorHandler";
import { accountService } from "@/lib/services/account";
import CompanyInfo from "@/components/dashboard/CompanyInfo";
import AccountForm from "@/components/dashboard/account/AccountForm";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import PreConfirmationDialog from "@/components/ui/dialog/PreConfirmationDialog";
import { hasRole } from "@/lib/utils/authUtils";

/**
 * Props for the AccountsCard component
 */
interface AccountsCardProps {
  isEditable?: boolean; // Whether the card is editable (default: false)
  isSubmitting: (value: boolean) => void;
  globalPortfolioSearch: (value: string) => void; // Function to handle global portfolio search
}

/**
 * Renders a card displaying a searchable list of company accounts with add functionality
 * @param props - The properties for configuring the card
 * @returns JSX.Element - The rendered accounts card
 */
const AccountsCard: React.FC<AccountsCardProps> = ({
  isEditable = false,
  isSubmitting,
  globalPortfolioSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showPreConfirmationDialog, setShowPreConfirmationDialog] =
    useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [displayEditFeature, setDisplayEditFeature] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account>(defaultData);
  const [showPreConfirmationDeleteDialog, setShowPreConfirmationDeleteDialog] =
    useState(false);

  const showAddFeature = hasRole("ADMINUSER");

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
        handleInfo({ code: 100103 });
      }
    } catch (err) {
      handleInfo({ code: 100104, error: err });
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
        handleInfo({ code: 100100 });
        fetchAccounts();
      } else {
        handleInfo({ code: 100105 });
      }
    } catch (err) {
      handleInfo({ code: 100106, error: err });
    }
  };

  const handleEditAccount = async (accountId: string, userData: Account) => {
    try {
      setShowAccountForm(false);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await accountService.update(accountId, userData);

      if (response?.status === "SUCCESS") {
        handleInfo({ code: 100107 });
        fetchAccounts();
      } else {
        handleInfo({ code: 100108 });
      }
    } catch (err) {
      handleInfo({ code: 100109, error: err });
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
        handleInfo({ code: isLocked ? 100110 : 100111 });
        return true;
      } else {
        // Revert on failure
        setAccounts(previousAccounts);
        handleInfo({ code: 100112 });
        return false;
      }
    } catch (err) {
      // Revert on exception
      setAccounts(previousAccounts);
      handleInfo({ code: 100113, error: err });
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

  const onClickDelete = async (account: Account) => {
    setShowPreConfirmationDeleteDialog(true);
    setSelectedAccount(account);
  };

  const handlePreConfirmationDeleteClose = () => {
    setShowPreConfirmationDeleteDialog(false);
    setSelectedAccount(defaultData);
  };

  // Handle delete action (placeholder for API call)
  const handleDelete = async () => {
    try {
      isSubmitting(true);
      setShowPreConfirmationDeleteDialog(false);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (!selectedAccount?.id) {
        throw new Error("Invalid user id.");
      }
      const response = await accountService.delete(selectedAccount.id);

      if (response?.status === "SUCCESS") {
        handleInfo({ code: 100114 });
        fetchAccounts();
      } else {
        handleInfo({ code: 100115 });
      }
    } catch (err) {
      handleInfo({ code: 100116, error: err });
    } finally {
      isSubmitting(false);
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
          showAddIcon={showAddFeature}
          onAddClick={handleAccountAdd}
          showRefreshIcon={true}
          onRefreshClick={fetchAccounts}
        />
        <div className="flex flex-col gap-3">
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((company, index) => (
              <CompanyInfo
                isSubmitting={(value: boolean) => isSubmitting(value)}
                isEditable={isEditable}
                key={index}
                details={company}
                onToggleAccess={handleToggleAccess}
                onEditClick={onEditAccountClick}
                onDelete={onClickDelete}
                globalPortfolioSearch={globalPortfolioSearch}
              />
            ))
          ) : (
            <div className="self-stretch p-2 bg-secondary-fill rounded-md inline-flex flex-col justify-start items-start gap-1 overflow-hidden">
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <div className="flex-1 justify-start text-dropdown-regular text-xs font-normal font-['Inter'] leading-[18px]">
                      No companies found matching your search.
                    </div>
                  </div>
                </div>
              </div>
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

      <PreConfirmationDialog
        isOpen={showPreConfirmationDeleteDialog}
        onClose={handlePreConfirmationDeleteClose}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message="Delete account user. This action will archive the account user and cannot be undone."
        confirmButtonLabel="Delete"
      />
    </>
  );
};

export default AccountsCard;
