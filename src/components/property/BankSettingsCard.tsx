import React, { useState, useEffect } from "react";
import PixieButton from "@/components/ui/buttons/PixieButton";
import CancelButton from "@/components/ui/buttons/CancelButton";
import SectionHeader from "@/components/ui/header/SectionHeader";
import { CustomDropdown } from "../ui/input/CustomDropdown";
import { DropdownOption } from "@/types/user";
import { CustomCheckbox } from "../ui/input/CustomCheckbox";

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

      <CustomCheckbox
        id="pendingAccountApprovalFlag"
        checked={formData.pendingAccountApprovalFlag}
        onChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            pendingAccountApprovalFlag: value,
          }))
        }
        label="Manage transfers of reconciled payments to property operating account (pending Account approval)"
        isEditing={isEditMode}
        labelClassName="text-tertiary-slateBlue text-sm font-medium"
      />

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
    </div>
  );
};

export default BankSettingsCard;
