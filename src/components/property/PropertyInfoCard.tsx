import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { DropdownOption } from "@/types/user";
import { PropertyInfoData } from "@/types/PropertyInfo";
import PixieButton from "@/components/ui/buttons/PixieButton";
import CustomInput from "@/components/ui/input/CustomInput";
import LinkButton from "@/components/ui/buttons/LinkButton";
import SectionHeader from "@/components/ui/header/SectionHeader";
import { PixieDatePicker } from "../ui/datePicker/PixieDatePicker";
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
  portfolioOptions: DropdownOption[];
  existingPropertyInfoData?: PropertyInfoData;
  largestMonthlyInvoiceOptions: DropdownOption[];
  categoryOptions: DropdownOption[];
  floorPlanOptions: DropdownOption[];
  elevatorPlanOptions: DropdownOption[];
  buildingStructureOptions: DropdownOption[];
  roofStructureOptions: DropdownOption[];
  sprinklerSystemOptions: DropdownOption[];
  firePanelsOptions: DropdownOption[];
}

const PropertyInfoCard: React.FC<PropertyInfoCardProps> = ({
  onEdit,
  sectionId,
  editingSection,
  onSectionEdit,
  onSectionClose,
  handlePropertyInfoUpdate,
  portfolioOptions,
  existingPropertyInfoData,
  largestMonthlyInvoiceOptions,
  categoryOptions,
  floorPlanOptions,
  elevatorPlanOptions,
  buildingStructureOptions,
  roofStructureOptions,
  sprinklerSystemOptions,
  firePanelsOptions,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const isEditing = isEditMode;

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
      payableRemittanceAddress: "",
      floorPlan: "",
      elvatorPlan: "",
      buildingStructure: "",
      roofStructure: "",
      constructionYear: "",
      propertyExpirationDate: "",
      firePanels: "",
      sprinklerSystem: "",
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
      payableRemittanceAddress: "",
      floorPlan: "",
      elvatorPlan: "",
      buildingStructure: "",
      roofStructure: "",
      constructionYear: "",
      propertyExpirationDate: "",
      firePanels: "",
      sprinklerSystem: "",
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
      payableRemittanceAddress: "",
      floorPlan: "",
      elvatorPlan: "",
      buildingStructure: "",
      roofStructure: "",
      constructionYear: "",
      propertyExpirationDate: "",
      firePanels: "",
      sprinklerSystem: "",
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
          />

          <PixieDropdown
            label="Portfolio"
            options={portfolioOptions}
            value={formData.portfolioName}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, portfolioName: value }))
            }
            readOnly={!isEditing}
            isEditing={isEditing}
            type="large"
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
              readOnly={!isEditing}
              isEditing={isEditing}
              type="large"
            />
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              label="Estimated total monthly collections"
              value={formData.estimatedMonthlyCollection}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  estimatedMonthlyCollection: value,
                }))
              }
              readOnly={!isEditing}
              isEditing={isEditing}
              labelClassName="text-tertiary-slateBlue text-sm font-medium"
              containerClassName="w-full"
            />

            <PixieDropdown
              label="Largest single monthly invoice"
              options={largestMonthlyInvoiceOptions}
              value={formData.largestMonthlyInvoice}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  largestMonthlyInvoice: value,
                }))
              }
              readOnly={!isEditing}
              isEditing={isEditing}
              type="large"
            />
          </div>

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
            containerClassName="w-full"
          />

          <AddressAutocompleteInput
            label="Address for payables remittance"
            value={formData.payableRemittanceAddress}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                payableRemittanceAddress: value,
              }))
            }
            isEditing={isEditing}
            placeholder="Start typing address..."
            inputId="payable-remittances-address-input"
          />

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <PixieDropdown
              label="Floors"
              options={floorPlanOptions}
              value={formData.floorPlan}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, floorPlan: value }))
              }
              readOnly={!isEditing}
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
              readOnly={!isEditing}
              isEditing={isEditing}
              type="large"
            />
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <PixieDropdown
              label="Building structure"
              options={buildingStructureOptions}
              value={formData.buildingStructure}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, buildingStructure: value }))
              }
              readOnly={!isEditing}
              isEditing={isEditing}
              type="large"
            />

            <PixieDropdown
              label="Roof structure"
              options={roofStructureOptions}
              value={formData.roofStructure}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, roofStructure: value }))
              }
              readOnly={!isEditing}
              isEditing={isEditing}
              type="large"
            />
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <PixieDatePicker
              label="Construction Year"
              value={formData.constructionYear}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  constructionYear: value,
                }))
              }
              isEditing={isEditing}
              readOnly={!isEditing}
              dateFormat={["year"]}
            />

            <PixieDatePicker
              label="Property Fire and Liability Insurance Expiration Date"
              value={formData.propertyExpirationDate}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  propertyExpirationDate: value,
                }))
              }
              isEditing={isEditing}
              readOnly={!isEditing}
            />
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <PixieDropdown
              label="Fire panels"
              options={firePanelsOptions}
              value={formData.firePanels}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, firePanels: value }))
              }
              readOnly={!isEditing}
              isEditing={isEditing}
              type="large"
            />

            <PixieDropdown
              label="Sprinkler system"
              options={sprinklerSystemOptions}
              value={formData.sprinklerSystem}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, sprinklerSystem: value }))
              }
              readOnly={!isEditing}
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
              <LinkButton onClick={handleTextClose} />
            </div>
          )}
        </form>
      </div>
    </ClientThemeWrapper>
  );
};

export default PropertyInfoCard;
