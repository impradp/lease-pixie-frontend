import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { DropdownOption } from "@/types/user";
import { hasRole } from "@/lib/utils/authUtils";
import { PropertyInfoData } from "@/types/PropertyInfo";
import CustomInput from "@/components/ui/input/CustomInput";
import LinkButton from "@/components/ui/buttons/LinkButton";
import PixieButton from "@/components/ui/buttons/PixieButton";
import SectionHeader from "@/components/ui/header/SectionHeader";
import { PixieDropdown } from "@/components/ui/input/PixieDropdown";
import { ClientThemeWrapper } from "@/components/ui/ClientThemeWrapper";

const AddressAutocompleteInput = dynamic(
  () =>
    import("@/components/ui/addressAutoCompleteInput/AddressAutoCompleteInput"),
  {
    ssr: false, // Disable SSR since it uses client-side Radar SDK
    loading: () => <p>Loading address input...</p>, // Optional fallback
  }
);

interface PropertyInfoCardProps {
  onEdit?: () => void;
  sectionId: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  handlePropertyInfoUpdate: () => void;
  onSectionClose: () => void;
  existingPropertyInfoData?: PropertyInfoData;
  categoryOptions: DropdownOption[];
  floorPlanOptions: DropdownOption[];
  elevatorPlanOptions: DropdownOption[];
}

const PropertyInfoCard: React.FC<PropertyInfoCardProps> = ({
  onEdit,
  sectionId,
  editingSection,
  onSectionEdit,
  onSectionClose,
  handlePropertyInfoUpdate,
  existingPropertyInfoData,
  categoryOptions,
  floorPlanOptions,
  elevatorPlanOptions,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const isEditing = isEditMode;
  const [portfolioUserAccess, setPortfolioUserAccess] = useState(false);

  const hasAccountUserAccess = hasRole("AccountUser");

  // Move the access check into useEffect to avoid infinite renders
  useEffect(() => {
    // TODO: Check with the API whether settings card is accessible for edit
    // For now, setting a default value that won't cause infinite renders
    setPortfolioUserAccess(false);
  }, []); // Empty dependency array means this runs once on mount

  const [formData, setFormData] = useState<PropertyInfoData>(
    existingPropertyInfoData || {
      portfolioName: "",
      propertyTitle: "",
      propertyEntityName: "",
      physicalPropertyAddress: "",
      estimatedMonthlyCollection: "",
      largestMonthlyInvoice: "",
      requestedBuildingSize: "",
      requestedCategory: "",
      propertyManagementLegalEntity: "",
      propertyManagementOfficePhoneNumber: "",
      propertyManagementemailAddress: "",
      vendorPayableRemittanceAddress: "",
      floorPlan: "",
      elvatorPlan: "",
    }
  );

  const [initialFormData, setInitialFormData] = useState<PropertyInfoData>(
    existingPropertyInfoData || {
      portfolioName: "",
      propertyTitle: "",
      propertyEntityName: "",
      physicalPropertyAddress: "",
      estimatedMonthlyCollection: "",
      largestMonthlyInvoice: "",
      requestedBuildingSize: "",
      requestedCategory: "",
      propertyManagementLegalEntity: "",
      propertyManagementOfficePhoneNumber: "",
      propertyManagementemailAddress: "",
      vendorPayableRemittanceAddress: "",
      floorPlan: "",
      elvatorPlan: "",
    }
  );

  // Sync initialFormData and formData with existingPropertyInfoData when it changes
  useEffect(() => {
    const defaultData = {
      portfolioName: "",
      propertyTitle: "",
      propertyEntityName: "",
      physicalPropertyAddress: "",
      estimatedMonthlyCollection: "",
      largestMonthlyInvoice: "",
      requestedBuildingSize: "",
      requestedCategory: "",
      propertyManagementLegalEntity: "",
      propertyManagementOfficePhoneNumber: "",
      propertyManagementemailAddress: "",
      vendorPayableRemittanceAddress: "",
      floorPlan: "",
      elvatorPlan: "",
    };
    setInitialFormData(existingPropertyInfoData || defaultData);
    setFormData(existingPropertyInfoData || defaultData);
  }, [existingPropertyInfoData]);

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
    handlePropertyInfoUpdate();
    onSectionClose();
  };

  const isEditDisabled =
    editingSection !== null && editingSection !== sectionId;

  return (
    <ClientThemeWrapper>
      <div
        className={`rounded-xl p-6 ${
          isEditMode ? "bg-card-open-fill" : "bg-card-close-fill"
        }`}
      >
        <form
          id="property-card"
          onSubmit={handleUpdate}
          className="flex items-center flex flex-col gap-4"
        >
          <SectionHeader
            title={"Property Information"}
            onEdit={handleEdit}
            onTextCancel={handleTextClose}
            showEditButton={!isEditMode}
            showTextCloseButton={isEditMode}
            editDisabled={isEditDisabled}
            cardActionContent="Portfolio User %s Edit"
            hasAccess={portfolioUserAccess}
            showCardActionContent={hasAccountUserAccess}
          />

          <CustomInput
            label="Property title"
            value={formData.propertyTitle}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, propertyTitle: value }))
            }
            readOnly={!isEditing}
            isEditing={isEditing}
            labelClassName="text-tertiary-slateBlue text-sm font-medium"
            containerClassName="w-full"
          />

          <CustomInput
            label="Property legal entity"
            value={formData.propertyEntityName}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, propertyEntityName: value }))
            }
            readOnly={!isEditing}
            isEditing={isEditing}
            labelClassName="text-tertiary-slateBlue text-sm font-medium"
            containerClassName="w-full"
          />

          <AddressAutocompleteInput
            label="Physical property address"
            value={formData.physicalPropertyAddress}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                physicalPropertyAddress: value,
              }))
            }
            isEditing={isEditing}
            placeholder="Start typing address..."
            inputId="physical-property-address-input"
          />

          <CustomInput
            label="Property management legal entity"
            value={formData.propertyManagementLegalEntity}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                propertyManagementLegalEntity: value,
              }))
            }
            readOnly={!isEditing}
            isEditing={isEditing}
            labelClassName="text-tertiary-slateBlue text-sm font-medium"
            containerClassName="w-full"
          />

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              label="Property management office phone number"
              value={formData.propertyManagementOfficePhoneNumber}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  propertyManagementOfficePhoneNumber: value,
                }))
              }
              readOnly={!isEditing}
              isEditing={isEditing}
              className="py-2.5 text-base text-tertiary-deepNavy"
              labelClassName="text-tertiary-slateBlue text-sm font-medium"
              placeholder="800-555-1234"
              type="mobile"
              containerClassName="w-full"
            />
            <CustomInput
              label="Property management email address"
              value={formData.propertyManagementemailAddress}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  propertyManagementemailAddress: value,
                }))
              }
              readOnly={!isEditing}
              isEditing={isEditing}
              className="py-2.5 text-base text-tertiary-deepNavy"
              labelClassName="text-tertiary-slateBlue text-sm font-medium"
              containerClassName="w-full"
              type="email"
            />
          </div>

          <AddressAutocompleteInput
            label="Address for vendor payables remittance"
            value={formData.vendorPayableRemittanceAddress}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                vendorPayableRemittanceAddress: value,
              }))
            }
            isEditing={isEditing}
            placeholder="Start typing address..."
            inputId="vendor-payable-remittances-address-input"
          />

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <PixieDropdown
              label="Floors"
              options={floorPlanOptions}
              value={formData.floorPlan}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, floorPlan: value }))
              }
              isEditing={isEditing}
              type="large"
            />

            <PixieDropdown
              label="Elevators"
              options={elevatorPlanOptions}
              value={formData.elvatorPlan}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, elvatorPlan: value }))
              }
              isEditing={isEditing}
              type="large"
            />
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              label="Requested building size (sq-ft)"
              value={formData.requestedBuildingSize}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  requestedBuildingSize: value,
                }))
              }
              readOnly={!isEditing}
              isEditing={isEditing}
              labelClassName="text-tertiary-slateBlue text-sm font-medium"
              containerClassName="w-full"
            />

            <PixieDropdown
              label="Requested category"
              options={categoryOptions}
              value={formData.requestedCategory}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, requestedCategory: value }))
              }
              isEditing={isEditing}
              type="large"
            />
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
    </ClientThemeWrapper>
  );
};

export default PropertyInfoCard;
