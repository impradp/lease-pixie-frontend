"use client";

import React, { useState, useEffect } from "react";
import handleInfo from "@/lib/utils/errorHandler";
import { DepositAccount } from "@/types/DepositAccount";
import LinkButton from "@/components/ui/buttons/LinkButton";
import CustomInput from "@/components/ui/input/CustomInput";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { SectionHeader } from "@/components/ui/header/SectionHeader";

/**
 * Props for the AccountForm component
 */
interface DepositAccountFormProps {
  onClose: () => void; // Callback to close the form
  onSubmit: (
    depositAccountData: DepositAccount,
    setLoading: (loading: boolean) => void
  ) => Promise<void>; // Callback to submit form data
  disabled?: boolean; // Whether the form is disabled (default: false)
  data: DepositAccount; // Initial account data
  isEditForm?: boolean; // Whether this is an edit form (default: false)
}

/**
 * Renders a form for creating or editing an account
 * @param props - The properties for configuring the form
 * @returns JSX.Element - The rendered account form
 */
const DepositAccountForm: React.FC<DepositAccountFormProps> = ({
  onClose,
  onSubmit,
  disabled = false,
  data,
  isEditForm = false,
}) => {
  const [formData, setFormData] = useState<DepositAccount>(data); // State for form data
  const [isLoading, setIsLoading] = useState(false); // State for form submission loading
  const isFormDisabled = isLoading || disabled; // Combined disabled state

  const isReadonly = isEditForm;

  // Effect to manage body overflow and scrollbar padding
  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const originalPadding = window.getComputedStyle(document.body).paddingRight;

    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.paddingRight = originalPadding;
      document.body.style.overflow = "";
    };
  }, []);

  /**
   * Validates the form data for required fields
   * @returns boolean - Whether the form is valid
   */
  const validateForm = (): boolean => {
    const isValid =
      formData?.accountHolderName?.trim() &&
      formData?.expMonthlyTotalInvoice?.trim() &&
      formData?.reqMaxSingleACHTxnLimit?.trim() &&
      formData?.lastFourDigits?.trim() &&
      formData?.issProcessor?.trim() &&
      formData?.issProcessorId?.trim() &&
      formData?.issMaxSingleACHTxnLimit?.trim() &&
      formData?.issMerchantAccountNumber?.trim();
    return !!isValid;
  };

  /**
   * Handles form submission
   * @param e - The form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormDisabled) return;

    if (!validateForm()) {
      handleInfo({ code: 100000 });
      return;
    }

    try {
      setIsLoading(true);
      await new Promise((resolve) => requestAnimationFrame(resolve)); // Simulate async operation
      await onSubmit(
        {
          ...formData,
        },
        setIsLoading
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsLoading(false);
    }
  };

  /**
   * Updates form data for a specific field
   * @param field - The field to update
   * @param value - The new value for the field
   */
  const handleInputChange = (field: keyof DepositAccount, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Handles form close action
   */
  const handleClose = () => {
    if (!isFormDisabled) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <SectionHeader
              title={
                isEditForm
                  ? "Update Deposit Bank Account"
                  : "Add Deposit Bank Account"
              }
              showCloseButton={true}
              onClose={handleClose}
            />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <CustomInput
              label="Account holder entity or name"
              value={formData.accountHolderName ?? ""}
              onChange={(value) =>
                handleInputChange("accountHolderName", value)
              }
              isEditing={true}
              disabled={isFormDisabled || isReadonly}
              isRequired={true}
            />

            <CustomInput
              label="Account description"
              value={formData.description ?? ""}
              onChange={(value) => handleInputChange("description", value)}
              isEditing={true}
              disabled={isFormDisabled || isReadonly}
              isRequired={true}
            />
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Expected monthly total invoices"
                value={formData.expMonthlyTotalInvoice ?? ""}
                onChange={(value) =>
                  handleInputChange("expMonthlyTotalInvoice", value)
                }
                isEditing={true}
                disabled={isFormDisabled}
                isRequired={true}
              />
              <CustomInput
                label="Requested maximum single ACH transaction limit"
                value={formData.reqMaxSingleACHTxnLimit ?? ""}
                onChange={(value) =>
                  handleInputChange("reqMaxSingleACHTxnLimit", value)
                }
                isEditing={true}
                disabled={isFormDisabled}
                isRequired={true}
              />
            </div>
            <CustomInput
              label="Last 4 digits of deposit account"
              value={formData.lastFourDigits ?? ""}
              onChange={(value) => handleInputChange("lastFourDigits", value)}
              isEditing={true}
              disabled={isFormDisabled}
              isRequired={true}
            />
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Issued processor"
                value={formData.issProcessor ?? ""}
                onChange={(value) => handleInputChange("issProcessor", value)}
                isEditing={true}
                disabled={isFormDisabled}
                isRequired={true}
              />
              <CustomInput
                label="Issued processor UUID"
                value={formData.issProcessorId ?? ""}
                onChange={(value) => handleInputChange("issProcessorId", value)}
                isEditing={true}
                disabled={isFormDisabled}
                isRequired={true}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Issued maximum single ACH transaction limit"
                value={formData.issMaxSingleACHTxnLimit ?? ""}
                onChange={(value) =>
                  handleInputChange("issMaxSingleACHTxnLimit", value)
                }
                isEditing={true}
                disabled={isFormDisabled}
                isRequired={true}
              />
              <CustomInput
                label="Issued merchant account number"
                value={formData.issMerchantAccountNumber ?? ""}
                onChange={(value) =>
                  handleInputChange("issMerchantAccountNumber", value)
                }
                isEditing={true}
                disabled={isFormDisabled}
                isRequired={true}
              />
            </div>
            <div className="flex flex-col gap-3">
              <PixieButton
                label={isEditForm ? "Update" : "Add Deposit Account"}
                disabled={isFormDisabled}
                type="submit"
                isLoading={isLoading}
              />
              <LinkButton onClick={handleClose} disabled={isFormDisabled} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepositAccountForm;
