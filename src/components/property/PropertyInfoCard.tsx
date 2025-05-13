import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

import { hasRole } from "@/lib/utils/authUtils";
import { PropertyInfoData } from "@/types/PropertyInfo";
import CustomInput from "@/components/ui/input/CustomInput";
import LinkButton from "@/components/ui/buttons/LinkButton";
import PixieButton from "@/components/ui/buttons/PixieButton";
import SectionHeader from "@/components/ui/header/SectionHeader";
import { PixieDropdown } from "@/components/ui/input/PixieDropdown";
import { ClientThemeWrapper } from "@/components/ui/ClientThemeWrapper";
import {
  categoryOptions,
  elevatorPlanOptions,
  floorPlanOptions,
} from "@/data/Properties";

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
  onSectionClose: () => void;
  existingPropertyInfoData?: PropertyInfoData;
  onPropertyInfoUpdate?: (data: PropertyInfoData) => void;
  onClickUpdate?: () => void;
}

const PropertyInfoCard: React.FC<PropertyInfoCardProps> = ({
  onEdit,
  sectionId,
  editingSection,
  onSectionEdit,
  onSectionClose,
  existingPropertyInfoData,
  onPropertyInfoUpdate,
  onClickUpdate,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [portfolioUserAccess, setPortfolioUserAccess] = useState(false);

  // Create ref to store the original data
  const originalDataRef = useRef<PropertyInfoData | undefined>(
    existingPropertyInfoData
  );

  // State for edited data that will be modified during edit mode
  const [editedData, setEditedData] = useState<PropertyInfoData>(
    existingPropertyInfoData || {
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

  const hasAccountUserAccess = hasRole("AccountUser");

  // Update refs and state when existingPropertyInfoData changes
  useEffect(() => {
    if (existingPropertyInfoData) {
      originalDataRef.current = { ...existingPropertyInfoData };
      if (!isEditMode) {
        setEditedData({ ...existingPropertyInfoData });
      }
    }
  }, [existingPropertyInfoData, isEditMode]);

  // Move the access check into useEffect to avoid infinite renders
  useEffect(() => {
    // TODO: Check with the API whether settings card is accessible for edit
    // For now, setting a default value that won't cause infinite renders
    setPortfolioUserAccess(false);
  }, []); // Empty dependency array means this runs once on mount

  const handleEdit = () => {
    if (editingSection === null || editingSection === sectionId) {
      setIsEditMode(true);
      onSectionEdit(sectionId);
      if (onEdit) onEdit();
    }
  };

  const handleTextClose = () => {
    // Reset to original values when canceling edit
    if (originalDataRef.current) {
      setEditedData({ ...originalDataRef.current });
    }
    setIsEditMode(false);
    onSectionClose();
  };

  const handleUpdate = async () => {
    setIsEditMode(false);
    if (onPropertyInfoUpdate) {
      await onPropertyInfoUpdate(editedData);
      // Update the original reference after successful update
      originalDataRef.current = { ...editedData };
    }
    onClickUpdate?.();
    onSectionClose();
  };

  const handleInputChange = (field: keyof PropertyInfoData, value: string) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
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
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
          className="flex flex-col gap-4"
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
            value={editedData.propertyTitle}
            onChange={(value) => handleInputChange("propertyTitle", value)}
            readOnly={!isEditMode}
            isEditing={isEditMode}
            labelClassName="text-tertiary-slateBlue text-sm font-medium"
            containerClassName="w-full"
            isRequired={true}
          />

          <CustomInput
            label="Property legal entity"
            value={editedData.propertyEntityName}
            onChange={(value) => handleInputChange("propertyEntityName", value)}
            readOnly={!isEditMode}
            isEditing={isEditMode}
            labelClassName="text-tertiary-slateBlue text-sm font-medium"
            containerClassName="w-full"
          />

          <AddressAutocompleteInput
            label="Physical property address"
            value={editedData.physicalPropertyAddress}
            onChange={(value) =>
              handleInputChange("physicalPropertyAddress", value)
            }
            isEditing={isEditMode}
            placeholder="Start typing address..."
            inputId="physical-property-address-input"
          />

          <CustomInput
            label="Property management legal entity"
            value={editedData.propertyManagementLegalEntity}
            onChange={(value) =>
              handleInputChange("propertyManagementLegalEntity", value)
            }
            readOnly={!isEditMode}
            isEditing={isEditMode}
            labelClassName="text-tertiary-slateBlue text-sm font-medium"
            containerClassName="w-full"
          />

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              label="Property management office phone number"
              value={editedData.propertyManagementOfficePhoneNumber}
              onChange={(value) =>
                handleInputChange("propertyManagementOfficePhoneNumber", value)
              }
              readOnly={!isEditMode}
              isEditing={isEditMode}
              className="py-2.5 text-base text-tertiary-deepNavy"
              labelClassName="text-tertiary-slateBlue text-sm font-medium"
              placeholder="800-555-1234"
              type="mobile"
              containerClassName="w-full"
            />
            <CustomInput
              label="Property management email address"
              value={editedData.propertyManagementemailAddress}
              onChange={(value) =>
                handleInputChange("propertyManagementemailAddress", value)
              }
              readOnly={!isEditMode}
              isEditing={isEditMode}
              className="py-2.5 text-base text-tertiary-deepNavy"
              labelClassName="text-tertiary-slateBlue text-sm font-medium"
              containerClassName="w-full"
              type="email"
            />
          </div>

          <AddressAutocompleteInput
            label="Address for vendor payables remittance"
            value={editedData.vendorPayableRemittanceAddress}
            onChange={(value) =>
              handleInputChange("vendorPayableRemittanceAddress", value)
            }
            isEditing={isEditMode}
            placeholder="Start typing address..."
            inputId="vendor-payable-remittances-address-input"
          />

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <PixieDropdown
              label="Floors"
              options={floorPlanOptions}
              value={editedData.floorPlan}
              onChange={(value) => handleInputChange("floorPlan", value)}
              isEditing={isEditMode}
              type="large"
            />

            <PixieDropdown
              label="Elevators"
              options={elevatorPlanOptions}
              value={editedData.elvatorPlan}
              onChange={(value) => handleInputChange("elvatorPlan", value)}
              isEditing={isEditMode}
              type="large"
            />
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              label="Requested building size (sq-ft)"
              value={editedData.requestedBuildingSize}
              onChange={(value) =>
                handleInputChange("requestedBuildingSize", value)
              }
              readOnly={!isEditMode}
              isEditing={isEditMode}
              labelClassName="text-tertiary-slateBlue text-sm font-medium"
              containerClassName="w-full"
            />

            <PixieDropdown
              label="Requested category"
              options={categoryOptions}
              value={editedData.requestedCategory}
              onChange={(value) =>
                handleInputChange("requestedCategory", value)
              }
              isEditing={isEditMode}
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
