import React, { useEffect, useState } from "react";

import { hasRole } from "@/lib/utils/authUtils";
import LinkButton from "@/components/ui/buttons/LinkButton";
import PixieButton from "@/components/ui/buttons/PixieButton";
import PixieTextArea from "@/components/ui/input/PixieTextArea";
import SectionHeader from "@/components/ui/header/SectionHeader";
import { InsuranceSettingsData } from "@/types/InsuranceSettings";
import { PixieDropdown } from "@/components/ui/input/PixieDropdown";

import {
  buildingStructureOptions,
  firePanelsOptions,
  roofStructureOptions,
  sampleInsuranceInfo,
  sprinklerSystemOptions,
} from "@/data/insuranceData";
import { PixieDatePicker } from "../ui/datePicker/PixieDatePicker";

interface InsuranceCardProps {
  sectionName: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
  isSubmitting: (value: boolean) => void;
  isEditable: boolean;
}

const InsuranceCard: React.FC<InsuranceCardProps> = ({
  sectionName,
  editingSection,
  onSectionEdit,
  onSectionClose,
  isSubmitting,
  isEditable,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] =
    useState<InsuranceSettingsData>(sampleInsuranceInfo);
  const [initialFormData, setInitialFormData] =
    useState<InsuranceSettingsData>(sampleInsuranceInfo);

  const [portfolioUserAccess, setPortfolioUserAccess] = useState(false);

  const hasAccountUserAccess = hasRole("AccountUser");

  // Move the access check into useEffect to avoid infinite renders
  useEffect(() => {
    // TODO: Check with the API whether settings card is accessible for edit
    // For now, setting a default value that won't cause infinite renders
    setPortfolioUserAccess(false);
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    setInitialFormData(sampleInsuranceInfo);
    setFormData(sampleInsuranceInfo);
  }, [sampleInsuranceInfo]);

  // Handle edit button click
  const handleEdit = () => {
    if (editingSection === null || editingSection === sectionName) {
      onSectionEdit(sectionName);
      setIsEditMode(true);
    }
  };

  // Handle cancel button click
  const handleTextClose = () => {
    setFormData(initialFormData); // Revert to initial values
    setIsEditMode(false);
    onSectionClose();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    isSubmitting(true);
    setIsEditMode(false);
    onSectionClose();
  };

  const isEditDisabled =
    editingSection !== null && editingSection !== sectionName;

  return (
    <div
      className={`rounded-xl p-6 ${
        isEditMode ? "bg-card-open-fill" : "bg-card-close-fill"
      }`}
    >
      <form
        id={`form-${sectionName}`}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <SectionHeader
          title={"Insurance"}
          onEdit={handleEdit}
          onTextCancel={handleTextClose}
          showEditButton={!isEditMode}
          showTextCloseButton={isEditMode}
          editDisabled={isEditDisabled}
          cardActionContent="Portfolio User %s Edit"
          hasAccess={portfolioUserAccess}
          showCardActionContent={hasAccountUserAccess}
          onAccessToggle={(val) => setPortfolioUserAccess(val)}
        />

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <PixieDropdown
            label="Fire panels"
            options={firePanelsOptions}
            value={formData.firePanels}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, firePanels: value }))
            }
            isEditing={isEditMode}
            type="large"
          />

          <PixieDropdown
            label="Sprinkler system"
            options={sprinklerSystemOptions}
            value={formData.sprinklerSystem}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, sprinklerSystem: value }))
            }
            isEditing={isEditMode}
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
            isEditing={isEditMode}
            readOnly={!isEditMode}
            dateFormat={["year"]}
          />

          <PixieDatePicker
            label="Property insurance expiration date (building)"
            value={formData.propertyExpirationDate}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                propertyExpirationDate: value,
              }))
            }
            isEditing={isEditMode}
            readOnly={!isEditMode}
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
            isEditing={isEditMode}
            type="large"
          />

          <PixieDropdown
            label="Roof structure"
            options={roofStructureOptions}
            value={formData.roofStructure}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, roofStructure: value }))
            }
            isEditing={isEditMode}
            type="large"
          />
        </div>

        <PixieTextArea
          label="Instruct tenants to issue the additionally insured party as follows:"
          value={formData.instructions}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              instructions: value,
            }))
          }
          isEditing={isEditMode}
          disabled={!isEditable}
        />
        {/* Show buttons only in edit mode */}
        {isEditMode && (
          <div className="flex flex-col gap-3">
            <PixieButton
              label={"Update"}
              type="submit"
              formId={`form-${sectionName}`}
              disabled={!isEditable}
              isLoading={!isEditable}
              className="w-full"
            />
            <div className="flex justify-center">
              <LinkButton onClick={handleTextClose} label="Cancel" />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default InsuranceCard;
