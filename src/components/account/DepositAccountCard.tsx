"use client";

import React, { useCallback, useState } from "react";

import handleInfo from "@/lib/utils/errorHandler";
import { defaultData, sampleData } from "@/data/depositAccount";
import { DepositAccount } from "@/types/DepositAccount";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import { depositAccountService } from "@/lib/services/depositAccount";
import DepositAccountForm from "@/components/account/DepositAccountForm";
import DepositAccountContent from "@/components/account/DepositAccountContent";
import { hasRole } from "@/lib/utils/authUtils";

interface DepositAccountsCardProps {
  isEditable?: boolean; // Whether the card is editable (default: false)
  isSubmitting: (value: boolean) => void;
}

/**
 * DepositAccountsCard displays a list of deposit accounts with options to add or edit accounts.
 * @param {DepositAccountsCardProps} props - The component props
 * @param {boolean} [props.isEditable=false] - Whether the card allows editing
 * @param {(value: boolean) => void} props.isSubmitting - Callback to update submitting state
 * @returns {JSX.Element} The rendered deposit accounts card component
 */
const DepositAccountsCard: React.FC<DepositAccountsCardProps> = ({
  isEditable = false,
  isSubmitting,
}) => {
  const [displayEditFeature, setDisplayEditFeature] = useState(false);
  const [selectedDepositAccount, setSelectedDepositAccount] =
    useState<DepositAccount>(defaultData);
  const [showDepositAccountForm, setShowDepositAccountForm] = useState(false);
  const [depositAccounts, setDepositAccounts] =
    useState<DepositAccount[]>(sampleData);

  const showAddIcon = hasRole("ACCOUNTUSER"); // Check if the user has the role to show add icon

  /**
   * Fetches deposit accounts from the service and updates state.
   */
  const fetchDepositAccounts = useCallback(async () => {
    isSubmitting(true); // Set submitting state to true
    try {
      const response = await depositAccountService.fetch();
      if (response.status === "SUCCESS") {
        setDepositAccounts(response?.data); // Update state with fetched accounts
      } else {
        handleInfo({ code: 100701 }); // Handle fetch failure
      }
    } catch (err) {
      handleInfo({ code: 100702, error: err }); // Handle fetch error
    } finally {
      isSubmitting(false); // Reset submitting state
    }
  }, [isSubmitting]);

  /**
   * Handles adding a new deposit account and refreshes the account list.
   */
  const handleAddDepositAccount = async () => {
    try {
      setShowDepositAccountForm(false); // Close the form
      await new Promise((resolve) => requestAnimationFrame(resolve)); // Ensure UI update
      if (!selectedDepositAccount) {
        throw new Error("No deposit account selected");
      }
      const response = await depositAccountService.create(
        selectedDepositAccount
      );

      if (response?.status === "SUCCESS") {
        handleInfo({ code: 100700 }); // Notify success
        fetchDepositAccounts(); // Refresh account list
      } else {
        handleInfo({ code: 100703 }); // Handle creation failure
      }
    } catch (err) {
      handleInfo({ code: 100704, error: err }); // Handle creation error
    }
  };

  /**
   * Closes the deposit account form and resets related states.
   */
  const handleCloseAccountModal = () => {
    setShowDepositAccountForm(false); // Hide the form
    setDisplayEditFeature(false); // Disable edit mode
    setSelectedDepositAccount(defaultData); // Reset selected account
  };

  return (
    <>
      <div className="relative w-[408px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
        <PixieCardHeader
          label={"Deposit Accounts"}
          isEditable={isEditable}
          showAddIcon={showAddIcon}
          onAddClick={() => setShowDepositAccountForm(true)} // Open form on add click
        />
        {depositAccounts?.map((account) => (
          <DepositAccountContent key={account.id} account={account} /> // Render each account
        ))}
      </div>
      {showDepositAccountForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <DepositAccountForm
            data={selectedDepositAccount}
            isEditForm={displayEditFeature}
            onClose={handleCloseAccountModal}
            onSubmit={handleAddDepositAccount}
          />
        </div>
      )}
    </>
  );
};

export default DepositAccountsCard;
