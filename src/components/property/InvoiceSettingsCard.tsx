import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

import { Upload } from "lucide-react";
import SubHeader from "@/components/ui/header/SubHeader";
import { InvoiceSettingsData } from "@/types/InvoiceSettings";
import PixieButton from "@/components/ui/buttons/PixieButton";
import CustomInput from "@/components/ui/input/CustomInput";
import LinkButton from "@/components/ui/buttons/LinkButton";
import SectionHeader from "@/components/ui/header/SectionHeader";
import CustomTextArea from "@/components/ui/input/CustomTextArea";
import { CustomCheckbox } from "@/components/ui/input/CustomCheckbox";
import { hasRole } from "@/lib/utils/authUtils";

const AddressAutocompleteInput = dynamic(
  () =>
    import("@/components/ui/addressAutoCompleteInput/AddressAutoCompleteInput"),
  {
    ssr: false, // Disable SSR since it uses client-side Radar SDK
    loading: () => <p>Loading address input...</p>, // Optional fallback
  }
);

interface InvoiceSettingsCardProps {
  onEdit?: () => void;
  sectionId: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  handleInvoiceSettingsCardUpdate: () => void;
  onSectionClose: () => void;
  existingInvoiceSettings?: InvoiceSettingsData;
  showInfo?: boolean;
  infoContent: string;
}

const InvoiceSettingsCard: React.FC<InvoiceSettingsCardProps> = ({
  onEdit,
  sectionId,
  editingSection,
  onSectionEdit,
  onSectionClose,
  handleInvoiceSettingsCardUpdate,
  existingInvoiceSettings,
  showInfo = false,
  infoContent,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<InvoiceSettingsData>(
    existingInvoiceSettings || {
      entityForInvoiceHeader: "",
      addressForInvoiceHeader: "",
      phoneForInvoiceHeader: "",
      taxRateBaseRentFlag: false,
      taxRateBaseRent: "",
      estimatedTotalMonthlyCollections: "",
      largestSingleMonthlyInvoice: "",
      defaultNoticeBody: "",
      w9CompletedFile: "",
    }
  );
  const [portfolioUserAccess, setPortfolioUserAccess] = useState(false);

  const hasAccountUserAccess = hasRole("AccountUser");

  // Move the access check into useEffect to avoid infinite renders
  useEffect(() => {
    // TODO: Check with the API whether settings card is accessible for edit
    // For now, setting a default value that won't cause infinite renders
    setPortfolioUserAccess(false);
  }, []); // Empty dependency array means this runs once on mount

  const [initialFormData, setInitialFormData] = useState<InvoiceSettingsData>(
    existingInvoiceSettings || {
      entityForInvoiceHeader: "",
      addressForInvoiceHeader: "",
      phoneForInvoiceHeader: "",
      taxRateBaseRentFlag: false,
      taxRateBaseRent: "",
      estimatedTotalMonthlyCollections: "",
      largestSingleMonthlyInvoice: "",
      defaultNoticeBody: "",
      w9CompletedFile: "",
    }
  );

  // Update initialFormData when existingInvoiceSettings changes
  useEffect(() => {
    setInitialFormData(
      existingInvoiceSettings || {
        entityForInvoiceHeader: "",
        addressForInvoiceHeader: "",
        phoneForInvoiceHeader: "",
        taxRateBaseRentFlag: false,
        taxRateBaseRent: "",
        estimatedTotalMonthlyCollections: "",
        largestSingleMonthlyInvoice: "",
        defaultNoticeBody: "",
        w9CompletedFile: "",
      }
    );
    setFormData(
      existingInvoiceSettings || {
        entityForInvoiceHeader: "",
        addressForInvoiceHeader: "",
        phoneForInvoiceHeader: "",
        taxRateBaseRentFlag: false,
        taxRateBaseRent: "",
        estimatedTotalMonthlyCollections: "",
        largestSingleMonthlyInvoice: "",
        defaultNoticeBody: "",
        w9CompletedFile: "",
      }
    );
  }, [existingInvoiceSettings]);

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
    handleInvoiceSettingsCardUpdate();
    onSectionClose();
  };

  const handleUploadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isEditMode && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        w9CompletedFile: file.name,
      }));
    }
  };

  const isEditDisabled =
    editingSection !== null && editingSection !== sectionId;

  return (
    <div
      className={`rounded-xl p-6 ${
        isEditMode ? "bg-card-open-fill" : "bg-card-close-fill"
      }`}
    >
      <form
        id="invoice-settings-card"
        onSubmit={handleUpdate}
        className="flex flex-col gap-4 items-start w-full"
      >
        <SectionHeader
          title={"Invoicing Settings"}
          onEdit={handleEdit}
          onTextCancel={handleTextClose}
          showEditButton={!isEditMode}
          showTextCloseButton={isEditMode}
          editDisabled={isEditDisabled}
          showInfo={showInfo}
          infoContent={infoContent}
          cardActionContent="Portfolio User %s Edit"
          hasAccess={portfolioUserAccess}
          showCardActionContent={hasAccountUserAccess}
        />

        <CustomInput
          label="Entity for invoice header"
          value={formData.entityForInvoiceHeader}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              entityForInvoiceHeader: value,
            }))
          }
          readOnly={!isEditMode}
          isEditing={isEditMode}
          labelClassName="text-tertiary-slateBlue text-sm font-medium"
          containerClassName="w-full"
        />

        <AddressAutocompleteInput
          label="Address for invoice header"
          value={formData.addressForInvoiceHeader}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              addressForInvoiceHeader: value,
            }))
          }
          isEditing={isEditMode}
          placeholder="Start typing address..."
          inputId="invoice-header-address-input"
        />

        <CustomInput
          label="Phone number for invoice header"
          value={formData.phoneForInvoiceHeader}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              phoneForInvoiceHeader: value,
            }))
          }
          readOnly={!isEditMode}
          isEditing={isEditMode}
          className="py-2.5 text-base text-tertiary-deepNavy"
          labelClassName="text-tertiary-slateBlue text-sm font-medium"
          placeholder="800-555-1234"
          containerClassName="w-full"
        />

        <CustomCheckbox
          id="taxRateBaseRentFlag"
          checked={formData.taxRateBaseRentFlag}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              taxRateBaseRentFlag: value,
            }))
          }
          label="Tax rate based on rent(%)"
          isEditing={isEditMode}
          labelClassName="text-tertiary-slateBlue text-sm font-medium"
        />

        <CustomInput
          value={formData.taxRateBaseRent}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              taxRateBaseRent: value,
            }))
          }
          readOnly={!(isEditMode && formData.taxRateBaseRentFlag)}
          isEditing={isEditMode}
          labelClassName="hidden"
          containerClassName="w-full"
        />

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="Estimated total monthly collections"
            value={formData.estimatedTotalMonthlyCollections}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                estimatedTotalMonthlyCollections: value,
              }))
            }
            readOnly={!isEditMode}
            isEditing={isEditMode}
            labelClassName="text-tertiary-slateBlue text-sm font-medium"
            containerClassName="w-full"
            type="money"
          />
          <CustomInput
            label="Largest single monthly invoice"
            value={formData.largestSingleMonthlyInvoice}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                largestSingleMonthlyInvoice: value,
              }))
            }
            readOnly={!isEditMode}
            isEditing={isEditMode}
            labelClassName="text-tertiary-slateBlue text-sm font-medium"
            containerClassName="w-full"
            type="money"
          />
        </div>

        <CustomTextArea
          label="Default notice text body"
          value={formData.defaultNoticeBody}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              defaultNoticeBody: value,
            }))
          }
          readOnly={!isEditMode}
          isEditing={isEditMode}
          labelClassName=""
          containerClassName="w-full"
        />

        <SubHeader
          label="Upload completed W-9 for tenant initiated 1099-MISC"
          className="text-tertiary-slateBlue text-sm font-medium"
        />
        <div className="flex w-[348px] flex-col items-center justify-center gap-4 py-2 self-center">
          <div className="relative h-12 w-12 overflow-hidden">
            <Upload className="absolute left-[6px] top-[6px] h-9 w-9 text-tertiary-darkGray" />
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-start justify-center gap-1">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <button
                  onClick={handleUploadClick}
                  disabled={!isEditMode}
                  className={`text-sm font-semibold leading-tight text-tertiary-light underline ${
                    isEditMode ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  Complete W-9 Upload
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xls,.xlsx"
                  className="hidden"
                  disabled={!isEditMode}
                />
              </div>
            </div>
            <div className="text-xs font-normal leading-tight text-tertiary-slateBlue">
              Format file PDF (max 10MB)
            </div>
            {formData.w9CompletedFile && (
              <div className="text-xs text-tertiary-darkGray">
                Uploaded: {formData.w9CompletedFile}
              </div>
            )}
          </div>
        </div>

        {isEditMode && (
          <div className="w-full flex flex-col gap-3">
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
      </form>
    </div>
  );
};

export default InvoiceSettingsCard;
