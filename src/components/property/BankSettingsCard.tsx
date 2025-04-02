import React, { useState, useEffect } from "react";

import toastr from "@/lib/func/toastr";
import { DropdownOption } from "@/types/user";
import PixieButton from "@/components/ui/buttons/PixieButton";
import CancelButton from "@/components/ui/buttons/CancelButton";
import SectionHeader from "@/components/ui/header/SectionHeader";
import { ToggleSwitch } from "@/components/ui/input/ToggleSwitch";
import PlaidPaymentSetup from "@/components/ui/PlaidPaymentSetup";
import { CustomDropdown } from "@/components/ui/input/CustomDropdown";

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

interface BankSettingsData {
  selectedBankAccount: string; // Stores the value of the selected bank account
  pendingAccountApprovalFlag: boolean;
}

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

  // Initial bank account value (e.g., empty string for "Select account")
  const initialBankData: BankSettingsData = {
    selectedBankAccount: selectedAccount, // Default to "Select account" (value: "")
    pendingAccountApprovalFlag: pendingAccountApproval,
  };

  const [showPlaidSetup, setShowPlaidSetup] = useState(false);

  const [formData, setFormData] = useState<BankSettingsData>(initialBankData);
  const [initialFormData, setInitialFormData] =
    useState<BankSettingsData>(initialBankData);

  // If you want to sync with external data in the future, you can use useEffect
  useEffect(() => {
    setFormData(initialBankData);
    setInitialFormData(initialBankData);
  }, []); // Empty dependency array since there's no external prop to sync with yet

  const handleEdit = () => {
    if (editingSection === null || editingSection === sectionId) {
      setIsEditMode(true);
      onSectionEdit(sectionId);
      if (onEdit) onEdit();
    }
  };

  const handleTextClose = () => {
    setFormData(initialFormData); // Revert to initial values
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

  const isEditDisabled =
    editingSection !== null && editingSection !== sectionId;

  const handleToggle = (field: keyof BankSettingsData) => () => {
    if (isEditMode) {
      setInitialFormData((prev) => {
        const newValue = !prev[field];
        if (!prev[field]) {
          setShowPlaidSetup(true);
        }
        return {
          ...prev,
          [field]: newValue,
        };
      });
    }
  };

  const initiatePlaidSetup = async (setLoading: (loading: boolean) => void) => {
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));

      //TODO: Call plaid setup API here
    } catch {
      //TODO: Handle log
      toastr({
        message: "Exception occured adding new portfolio vendor.",
        toastrType: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const closePlaidSetup = () => {
    setShowPlaidSetup(false);
  };

  return (
    <div
      className={`flex items-start rounded-xl p-6 flex flex-col gap-4 ${
        isEditMode ? "bg-card-open-fill" : "bg-card-close-fill"
      }`}
    >
      <SectionHeader
        title={"Bank Settings"}
        onEdit={handleEdit}
        onTextCancel={handleTextClose}
        showEditButton={!isEditMode}
        showTextCloseButton={isEditMode}
        editDisabled={isEditDisabled}
        showInfo={showInfo}
        infoContent={showInfoContent}
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
          {"Off"}
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
          {"Operating Account Transfers"}
        </span>
      </div>

      {isEditMode && (
        <div className="w-full flex flex-col gap-3">
          <PixieButton
            label="Update"
            disabled={false}
            onClick={handleUpdate}
            className="w-full"
          />
          <CancelButton onClick={handleTextClose} />
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
