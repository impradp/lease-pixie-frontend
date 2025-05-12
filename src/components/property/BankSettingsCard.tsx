"use client";

import React, { useState, useEffect } from "react";
import toastr from "@/lib/func/toastr";
import { DropdownOption } from "@/types/user";
import { BankSettingsData } from "@/types/Property";
import PixieButton from "@/components/ui/buttons/PixieButton";
import LinkButton from "@/components/ui/buttons/LinkButton";
import SectionHeader from "@/components/ui/header/SectionHeader";
import { ToggleSwitch } from "@/components/ui/input/ToggleSwitch";
import PlaidPaymentSetup from "@/components/ui/PlaidPaymentSetup";
import { CustomDropdown } from "@/components/ui/input/CustomDropdown";
import { hasRole } from "@/lib/utils/authUtils";

/**
 * Props for the BankSettingsCard component
 */
interface BankSettingsCardProps {
  onEdit?: () => void;
  sectionId: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  handleBankSettingsUpdate: () => void;
  onSectionClose: () => void;
  defaultBankAccountOptions: DropdownOption[];
  selectedAccount: string;
  pendingAccountApproval: boolean;
  showInfo?: boolean;
  showInfoContent: string;
}

/**
 * Renders a card for managing bank settings with edit functionality
 * @param props - The properties for configuring the card
 * @returns JSX.Element - The rendered bank settings card
 */
const BankSettingsCard: React.FC<BankSettingsCardProps> = ({
  onEdit,
  sectionId,
  editingSection,
  onSectionEdit,
  onSectionClose,
  handleBankSettingsUpdate,
  defaultBankAccountOptions,
  selectedAccount,
  pendingAccountApproval = false,
  showInfo = false,
  showInfoContent,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPlaidSetup, setShowPlaidSetup] = useState(false);
  const initialBankData: BankSettingsData = {
    selectedBankAccount: selectedAccount,
    pendingAccountApprovalFlag: pendingAccountApproval,
  };
  const [formData, setFormData] = useState<BankSettingsData>(initialBankData);
  const [initialFormData, setInitialFormData] =
    useState<BankSettingsData>(initialBankData);

  const [portfolioUserAccess, setPortfolioUserAccess] = useState(false);

  const hasAccountUserAccess = hasRole("AccountUser");

  useEffect(() => {
    // TODO: Check with the API whether settings card is accessible for edit
    // For now, setting a default value that won't cause infinite renders
    setPortfolioUserAccess(false);
    setFormData(initialBankData);
    setInitialFormData(initialBankData);
  }, []);

  const handleEdit = () => {
    if (editingSection === null || editingSection === sectionId) {
      setIsEditMode(true);
      onSectionEdit(sectionId);
      onEdit?.();
    }
  };

  const handleTextClose = () => {
    setFormData(initialFormData);
    setIsEditMode(false);
    onSectionClose();
  };

  const handleUpdate = () => {
    setIsEditMode(false);
    handleBankSettingsUpdate();
    onSectionClose();
  };

  const handleBankChange = (option: DropdownOption) => {
    setFormData((prev) => ({
      ...prev,
      selectedBankAccount: option.value,
    }));
  };

  const handleToggle = (field: keyof BankSettingsData) => () => {
    if (isEditMode) {
      setInitialFormData((prev) => {
        const newValue = !prev[field];
        if (!prev[field]) setShowPlaidSetup(true);
        return { ...prev, [field]: newValue };
      });
    }
  };

  const initiatePlaidSetup = async (setLoading: (loading: boolean) => void) => {
    setLoading(true);
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      // TODO: Call plaid setup API here
    } catch {
      toastr({
        message: "Exception occurred adding new portfolio vendor.",
        toastrType: "error",
      });
      // TODO: Handle log
    } finally {
      setLoading(false);
    }
  };

  const closePlaidSetup = () => {
    setShowPlaidSetup(false);
  };

  const isEditDisabled =
    editingSection !== null && editingSection !== sectionId;

  return (
    <div
      className={`flex flex-col gap-4 rounded-xl p-6 ${
        isEditMode ? "bg-card-open-fill" : "bg-card-close-fill"
      }`}
    >
      <SectionHeader
        title="Bank Settings"
        onEdit={handleEdit}
        onTextCancel={handleTextClose}
        showEditButton={!isEditMode}
        showTextCloseButton={isEditMode}
        editDisabled={isEditDisabled}
        showInfo={showInfo}
        infoContent={showInfoContent}
        cardActionContent="Portfolio User %s Edit"
        hasAccess={portfolioUserAccess}
        showCardActionContent={hasAccountUserAccess}
      />
      <CustomDropdown
        label="Deposit and merchant bank account"
        options={defaultBankAccountOptions}
        value={formData.selectedBankAccount}
        onChange={handleBankChange}
        readOnly={!isEditMode}
        isEditing={isEditMode}
      />
      <div className="flex items-center gap-3">
        <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
          Off
        </span>
        <ToggleSwitch
          isOn={
            isEditMode
              ? initialFormData.pendingAccountApprovalFlag
              : formData.pendingAccountApprovalFlag
          }
          onToggle={handleToggle("pendingAccountApprovalFlag")}
          isDisabled={!isEditMode}
          className="w-9"
        />
        <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
          Operating Account Transfers
        </span>
      </div>
      {isEditMode && (
        <div className="flex flex-col gap-3">
          <PixieButton
            label="Update"
            disabled={false}
            onClick={handleUpdate}
            className="w-full"
          />
          <div className="flex justify-center">
            <LinkButton onClick={handleTextClose} />
          </div>
        </div>
      )}
      {showPlaidSetup && (
        <PlaidPaymentSetup
          onSubmit={initiatePlaidSetup}
          onClose={closePlaidSetup}
        />
      )}
    </div>
  );
};

export default BankSettingsCard;
