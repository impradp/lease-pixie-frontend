/**
 * Reusable component for displaying and editing vendor information.
 * Shows company name and service description in closed mode.
 * In edit mode, displays a full form with all vendor fields.
 * Ensures only one card can be edited at a time via global editingSection state.
 * @param props - Component props
 * @param props.vendorId - Unique identifier for the vendor
 * @param props.defaultData - Default vendor data
 * @param props.editingSection - Currently editing section ID
 * @param props.onSectionEdit - Callback to set editing section
 * @param props.onSectionClose - Callback to clear editing section
 * @param props.onSubmit - Callback to handle form submission
 * @param props.onDelete - Callback to handle vendor deletion
 * @returns JSX.Element - The rendered vendor card
 */
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import toastr from "@/lib/func/toastr";
import { NewVendorFormData } from "@/types/vendor";
import LinkButton from "@/components/ui/buttons/LinkButton";
import CustomInput from "@/components/ui/input/CustomInput";
import PixieButton from "@/components/ui/buttons/PixieButton";
import PixieTextArea from "@/components/ui/input/PixieTextArea";
import SectionHeader from "@/components/ui/header/SectionHeader";
import { CustomCheckbox } from "@/components/ui/input/CustomCheckbox";
import ConfirmationDialog from "@/components/ui/dialog/ConfirmationDialog";
import PreConfirmationDialog from "@/components/ui/dialog/PreConfirmationDialog";

const AddressAutocompleteInput = dynamic(
  () =>
    import("@/components/ui/addressAutoCompleteInput/AddressAutoCompleteInput"),
  {
    ssr: false, // Disable SSR for client-side Radar SDK
    loading: () => <p>Loading address input...</p>,
  }
);

interface VendorCardProps {
  vendorId: string;
  defaultData: NewVendorFormData;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
  onSubmit: (vendorId: string, updatedData: NewVendorFormData) => void;
  onDelete?: (vendorId: string) => void;
  onRestore?: (vendorId: string) => void;
}

const VendorCard: React.FC<VendorCardProps> = ({
  vendorId,
  defaultData,
  editingSection,
  onSectionEdit,
  onSectionClose,
  onSubmit,
  onDelete,
  onRestore,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<NewVendorFormData>(defaultData);
  const [initialFormData, setInitialFormData] =
    useState<NewVendorFormData>(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteRevisionDialog, setShowDeleteRevisionDialog] =
    useState(false);
  const [showPreConfirmationDialog, setShowPreConfirmationDialog] =
    useState(false);
  const [showRestoreConfirmationDialog, setShowRestoreConfirmationDialog] =
    useState(false);

  // Sync initialFormData when defaultData changes
  useEffect(() => {
    setInitialFormData(defaultData);
    setFormData(defaultData);
  }, [defaultData]);

  // Handle edit button click
  const handleEdit = () => {
    if (editingSection === null || editingSection === vendorId) {
      setIsEditMode(true);
      onSectionEdit(vendorId);
    }
  };

  // Handle cancel button click
  const handleTextClose = () => {
    setFormData(initialFormData); // Revert to initial values
    setIsEditMode(false);
    onSectionClose();
  };

  // Handle delete button click
  const handleDelete = () => {
    if (defaultData.portfolios && defaultData.portfolios.length > 0) {
      setShowDeleteRevisionDialog(true);
    } else {
      setShowPreConfirmationDialog(true);
    }
  };

  const handleRestore = () => {
    if (defaultData.isDeleted) {
      setShowRestoreConfirmationDialog(true);
    }
  };

  const initiateDelete = () => {
    setShowPreConfirmationDialog(false);
    if (defaultData?.id) {
      onDelete?.(defaultData.id.toString());
    }
  };

  const initiateRestore = () => {
    setShowRestoreConfirmationDialog(false);
    if (defaultData?.id) {
      onRestore?.(defaultData.id.toString());
    }
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const isValid =
      formData.companyName.trim() &&
      formData.serviceDescription.trim() &&
      formData.officePhoneNumber.trim() &&
      formData.folderName?.trim() &&
      formData.memo?.trim() &&
      formData.emailAddress.trim();
    return !!isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toastr({
        message: "Required fields (*) are empty.",
        toastrType: "error",
      });
      return;
    }
    try {
      setIsLoading(true);
      // Simulate async operation
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const cleanedData = {
        ...formData,
        mobileNumber: formData.mobileNumber.replaceAll("-", ""),
        officePhoneNumber: formData.officePhoneNumber.replaceAll("-", ""),
      };
      onSubmit(vendorId, cleanedData);
      setIsEditMode(false);
      onSectionClose();
    } catch {
      toastr({
        message: "Failed to update vendor.",
        toastrType: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (field: keyof NewVendorFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Generate numbered points for delete confirmation dialog
  const generateDeleteBulletPoints = (): string[] => {
    if (!defaultData.portfolios || defaultData.portfolios.length === 0) {
      return [];
    }

    const bulletPoints: string[] = [];
    defaultData.portfolios.forEach((portfolio, index) => {
      if (
        portfolio.taxReportingSeatVendorId === defaultData.id ||
        portfolio.insuranceSeatVendorId === defaultData.id ||
        portfolio.attorneySeatVendorId === defaultData.id
      ) {
        const seatType =
          portfolio.taxReportingSeatVendorId === defaultData.id
            ? "Accounting seat"
            : portfolio.insuranceSeatVendorId === defaultData.id
            ? "Insurance seat"
            : "Attorney seat";
        bulletPoints.push(`${index + 1}) ${portfolio.name}: ${seatType}`);
      }
    });

    return bulletPoints;
  };

  // Determine seat type for a portfolio
  const getSeatType = (
    portfolio: NonNullable<NewVendorFormData["portfolios"]>[number]
  ): string => {
    if (portfolio.taxReportingSeatVendorId === defaultData.id) {
      return "Accounting seat";
    } else if (portfolio.insuranceSeatVendorId === defaultData.id) {
      return "Insurance seat";
    } else if (portfolio.attorneySeatVendorId === defaultData.id) {
      return "Attorney seat";
    }
    return ""; // Return empty string if no match
  };

  const isEditDisabled = editingSection !== null && editingSection !== vendorId;

  const handlePreConfirmationClose = () => {
    setShowPreConfirmationDialog(false);
  };

  const handleDocumentLog = () => {
    //Document log
  };

  const handleEditLog = () => {
    //edit log
  };

  return (
    <>
      <div
        className={`rounded-xl p-6 ${
          isEditMode ? "bg-card-open-fill" : "bg-card-close-fill"
        }`}
      >
        <form
          id={`vendor-form-${vendorId}`}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <SectionHeader
            title={initialFormData.companyName}
            editLabel={"View"}
            onEdit={handleEdit}
            onTextCancel={handleTextClose}
            showEditButton={!isEditMode}
            showTextCloseButton={isEditMode}
            editDisabled={isEditDisabled}
            closeLabel="Close"
          />

          {isEditMode && (
            <CustomInput
              label="Company Name"
              value={formData.companyName}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, companyName: value }))
              }
              isEditing={isEditMode}
              disabled={isLoading}
              isRequired={true}
            />
          )}
          {isEditMode && (
            <CustomInput
              label="Folder Name (10 characters)"
              value={formData.folderName ?? ""}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, folderName: value }))
              }
              isEditing={isEditMode}
              disabled={isLoading}
              isRequired={true}
              maxCharLength={10}
            />
          )}
          {/* Always show service description */}
          <CustomInput
            label="Service description (40 character limit)"
            value={formData.serviceDescription}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, serviceDescription: value }))
            }
            isEditing={isEditMode}
            placeholder="i.e. Electrician"
            disabled={isLoading}
            isRequired={true}
            maxCharLength={40}
          />

          {/* Show additional fields only in edit mode */}
          {isEditMode && (
            <>
              <AddressAutocompleteInput
                label="Company Address"
                value={formData.companyAddress}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, companyAddress: value }))
                }
                isEditing={true}
                placeholder="Start typing address..."
                inputId={`company-address-input-${vendorId}`}
                disabled={isLoading}
              />
              <CustomInput
                label="Office phone number"
                value={formData.officePhoneNumber}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, officePhoneNumber: value }))
                }
                isEditing={true}
                placeholder="800-555-1234"
                type="mobile"
                disabled={isLoading}
                isRequired={true}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  label="Vendor contact first name"
                  value={formData.contactFirstName}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactFirstName: value,
                    }))
                  }
                  isEditing={true}
                  placeholder="First"
                  disabled={isLoading}
                />
                <CustomInput
                  label="Vendor contact last name"
                  value={formData.contactLastName}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, contactLastName: value }))
                  }
                  isEditing={true}
                  placeholder="Last"
                  disabled={isLoading}
                />
              </div>
              <CustomInput
                label="Email address"
                value={formData.emailAddress}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, emailAddress: value }))
                }
                isEditing={true}
                disabled={isLoading}
                isRequired={true}
              />
              <CustomInput
                label="Mobile phone number"
                value={formData.mobileNumber}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, mobileNumber: value }))
                }
                isEditing={true}
                placeholder="800-555-1234"
                type="mobile"
                disabled={isLoading}
              />
              <div className="space-y-4 pt-2">
                <CustomCheckbox
                  id={`requestW9-${vendorId}`}
                  checked={formData.requestW9}
                  onChange={() => handleCheckboxChange("requestW9")}
                  label="Get W-9"
                  isEditing={true}
                  // disabled={isLoading}
                />
                <CustomCheckbox
                  id={`send1099-${vendorId}`}
                  checked={formData.send1099}
                  onChange={() => handleCheckboxChange("send1099")}
                  label="Send 1099"
                  isEditing={true}
                  // disabled={isLoading}
                />
                <CustomCheckbox
                  id={`getInsuranceCert-${vendorId}`}
                  checked={formData.getInsuranceCert}
                  onChange={() => handleCheckboxChange("getInsuranceCert")}
                  label="Get insurance certificate"
                  isEditing={isEditMode}
                  // disabled={isLoading}
                />
                <div className="w-[752px] h-px bg-tertiary-stroke" />
                <PixieTextArea
                  label="Provide a memo for your edits"
                  value={formData.memo ?? ""}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, memo: value }))
                  }
                  isEditing={isEditMode}
                  isRequired={true}
                />
                {defaultData.portfolios &&
                  defaultData.portfolios.length > 0 && (
                    <>
                      <div className="w-[752px] self-stretch inline-flex justify-start items-start gap-4">
                        <div className="w-[752px] inline-flex flex-col justify-start items-start gap-2.5">
                          {defaultData.portfolios.map((portfolio) => (
                            <div
                              key={portfolio.id}
                              className="w-[752px] h-9 inline-flex justify-start items-start gap-4"
                            >
                              <div className="w-[537px] inline-flex flex-col justify-start items-start gap-2.5">
                                <div className="inline-flex justify-start items-center gap-2">
                                  <div className="h-[33px] inline-flex flex-col justify-center items-start gap-0.5">
                                    <div className="justify-start">
                                      <span className="text-secondary-light text-base font-semibold font-['Inter'] underline leading-normal">
                                        {portfolio.name}
                                      </span>
                                      <span className="text-secondary-light text-base font-semibold font-['Inter'] leading-normal">
                                        :{" "}
                                      </span>
                                      <span className="text-secondary-light text-base font-normal font-['Inter'] leading-normal">
                                        {getSeatType(portfolio)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                <div className="w-full flex flex-col items-end">
                  <div className="inline-flex items-center">
                    <LinkButton
                      label="edit log"
                      onClick={handleEditLog}
                      disabled={!isEditMode}
                      iconType="download"
                      showIcon={true}
                      className="text-secondary-light text-xs font-normal font-['Inter'] underline leading-[18px]"
                    />
                  </div>
                  <div className="inline-flex items-center">
                    <LinkButton
                      label="document log"
                      onClick={handleDocumentLog}
                      disabled={!isEditMode}
                      iconType="download"
                      showIcon={true}
                      className="text-secondary-light text-xs font-normal font-['Inter'] underline leading-[18px]"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Show buttons only in edit mode */}
          {isEditMode && !defaultData?.isDeleted && (
            <div className="flex flex-col gap-3">
              <PixieButton
                label={"Update"}
                type="submit"
                formId={`vendor-form-${vendorId}`}
                disabled={isLoading}
                isLoading={isLoading}
                className="w-full"
              />
              <div className="flex justify-center">
                <LinkButton onClick={handleDelete} label="Delete" />
              </div>
            </div>
          )}
          {isEditMode && defaultData?.isDeleted && (
            <div className="flex flex-col gap-3">
              <PixieButton
                label={"Restore from Archive"}
                type="button"
                disabled={isLoading}
                isLoading={isLoading}
                className="w-full"
                onClick={handleRestore}
              />
            </div>
          )}
        </form>
      </div>
      <ConfirmationDialog
        isOpen={showDeleteRevisionDialog}
        onClose={() => setShowDeleteRevisionDialog(false)}
        title="Delete Revision Required"
        message="To delete the vendor, please remove the vendor from the following portfolios:"
        bulletPoints={generateDeleteBulletPoints()}
        buttonLabel="Close"
      />
      <PreConfirmationDialog
        isOpen={showPreConfirmationDialog}
        onClose={handlePreConfirmationClose}
        onConfirm={initiateDelete}
        title="Confirm Delete"
        message="Delete vendor. This action will archive the vendor and cannot be undone."
        confirmButtonLabel="Delete Vendor"
      />

      <PreConfirmationDialog
        isOpen={showRestoreConfirmationDialog}
        onClose={() => setShowRestoreConfirmationDialog(false)}
        onConfirm={initiateRestore}
        title="Confirm Restore"
        message="Restore vendor. This action will restore the vendor and will be set active."
        confirmButtonLabel="Restore"
      />
    </>
  );
};

export default VendorCard;
