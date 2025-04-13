"use client";

import React, { useState, useCallback } from "react";
import { Account } from "@/types/Account";
import handleInfo from "@/lib/utils/errorHandler";
import { accountService } from "@/lib/services/account";
import LinkButton from "@/components/ui/buttons/LinkButton";
import AccountForm from "@/components/dashboard/account/AccountForm";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";

/**
 * Props for the PropertyApprovalCard component
 */
interface AccountDetailsProps {
  details: Account;
  isSubmitting: (value: boolean) => void;
}

/**
 * Renders a card for account details with editable fields
 * @param props - The properties for configuring the card
 * @returns JSX.Element - The rendered property approval card
 */
const AccountDetails: React.FC<AccountDetailsProps> = ({
  details,
  isSubmitting,
}) => {
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [displayEditFeature, setDisplayEditFeature] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<Account>(details);

  const handleCloseAccountModal = () => {
    setShowAccountForm(false);
    setDisplayEditFeature(false);
  };

  // Fetch accounts for admin
  const fetchAccounts = useCallback(async () => {
    isSubmitting(true);
    try {
      if (selectedAccount?.id) {
        const response = await accountService.fetchById(
          Number(selectedAccount.id)
        );
        if (response.status === "SUCCESS") {
          setSelectedAccount(response?.data);
        } else {
          handleInfo({ code: 100103 });
        }
      }
    } catch (err) {
      handleInfo({ code: 100104, error: err });
    } finally {
      isSubmitting(false);
    }
  }, [isSubmitting]);

  const handleEditAccount = async (userData: Account) => {
    try {
      isSubmitting(true);
      setShowAccountForm(false);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (userData?.id) {
        const response = await accountService.update(userData.id, userData);
        if (response?.status === "SUCCESS") {
          handleInfo({ code: 100107 });
          fetchAccounts();
        } else {
          handleInfo({ code: 100108 });
        }
      }
    } catch (err) {
      handleInfo({ code: 100109, error: err });
    } finally {
      isSubmitting(false);
    }
  };

  const onClickEdit = () => {
    setShowAccountForm(true);
    setDisplayEditFeature(true);
  };

  return (
    <div className="relative w-[408px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
      <PixieCardHeader label="Account Details" />
      <div className="self-stretch p-3 bg-[#ececec] rounded-xl inline-flex flex-col justify-start items-start gap-1">
        <div className="self-stretch inline-flex justify-start items-start gap-2">
          <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch inline-flex justify-start items-start gap-1">
              <div className="flex-1 justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                Company
              </div>

              <LinkButton label="Edit" onClick={onClickEdit} />
            </div>
            <div className="self-stretch inline-flex justify-start items-start gap-1">
              <div className="flex-1 justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                {details?.companyName}
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-1">
              <div className="self-stretch p-2 bg-gray-50 rounded-md flex flex-col justify-start items-start gap-1 overflow-hidden">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch inline-flex justify-start items-start gap-1">
                    <div className="justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                      Address
                    </div>
                    <div className="flex-1 justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                      {details?.address}
                    </div>
                  </div>
                  <div className="self-stretch h-[18px] inline-flex justify-start items-start gap-1">
                    <div className="justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                      Contact
                    </div>
                    <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                      {details?.contactFirstName +
                        " " +
                        details?.contactLastName}
                    </div>
                  </div>
                  <div className="self-stretch h-[18px] inline-flex justify-start items-start gap-1">
                    <div className="justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                      E-mail
                    </div>
                    <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                      {details?.email}
                    </div>
                  </div>
                  <div className="self-stretch h-[18px] inline-flex justify-start items-start gap-1">
                    <div className="justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                      Office
                    </div>
                    <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                      {details?.officePhoneNumber}
                    </div>
                  </div>
                  <div className="self-stretch h-[18px] inline-flex justify-start items-start gap-1">
                    <div className="justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                      Mobile
                    </div>
                    <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                      {details?.mobileNumber}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAccountForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <AccountForm
            data={selectedAccount}
            isEditForm={displayEditFeature}
            onClose={handleCloseAccountModal}
            onSubmit={handleEditAccount}
          />
        </div>
      )}
    </div>
  );
};

export default AccountDetails;
