import React, { useEffect, useState, useRef } from "react";

import { DropdownOption } from "@/types/user";
import { hasRole } from "@/lib/utils/authUtils";
import { PropertyInfoData } from "@/types/PropertyInfo";
import { defaultPropertyInfo } from "@/data/Properties";
import CustomInput from "@/components/ui/input/CustomInput";
import LinkButton from "@/components/ui/buttons/LinkButton";
import PixieButton from "@/components/ui/buttons/PixieButton";
import SectionHeader from "@/components/ui/header/SectionHeader";
import { PixieDropdown } from "@/components/ui/input/PixieDropdown";
import { ClientThemeWrapper } from "@/components/ui/ClientThemeWrapper";

interface CreateSettingsCardProps {
  onEdit?: () => void;
  sectionId: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  onSectionClose: () => void;
  existingPropertyInfoData?: PropertyInfoData;
  onCreateSettingsUpdate?: (data: PropertyInfoData) => void;
  onClickUpdate?: () => void;
  isEditable?: boolean;
  portfolioOptions: DropdownOption[];
}

const CreateSettingsCard: React.FC<CreateSettingsCardProps> = ({
  onEdit,
  sectionId,
  editingSection,
  onSectionEdit,
  onSectionClose,
  existingPropertyInfoData,
  onCreateSettingsUpdate,
  onClickUpdate,
  isEditable = false,
  portfolioOptions = [],
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [portfolioUserAccess, setPortfolioUserAccess] = useState(false);

  const originalDataRef = useRef<PropertyInfoData>(existingPropertyInfoData);
  const [editedData, setEditedData] = useState<PropertyInfoData>(
    existingPropertyInfoData || defaultPropertyInfo
  );

  const hasAccountUserAccess = hasRole("AccountUser");

  useEffect(() => {
    if (existingPropertyInfoData) {
      originalDataRef.current = { ...existingPropertyInfoData };
      if (!isEditMode) {
        setEditedData({ ...existingPropertyInfoData });
      }
    }
  }, [existingPropertyInfoData, isEditMode]);

  useEffect(() => {
    setPortfolioUserAccess(false); // TODO: Check with API
  }, []);

  const handleEdit = () => {
    if (editingSection === null || editingSection === sectionId) {
      setIsEditMode(true);
      onSectionEdit(sectionId);
      if (onEdit) onEdit();
    }
  };

  const handleTextClose = () => {
    if (originalDataRef.current) {
      setEditedData({ ...originalDataRef.current });
    }
    setIsEditMode(false);
    onSectionClose();
  };

  const handleUpdate = async () => {
    setIsEditMode(false);
    if (onCreateSettingsUpdate) {
      await onCreateSettingsUpdate(editedData);
      originalDataRef.current = { ...editedData };
    }
    onClickUpdate?.();
    onSectionClose();
  };

  const handleInputChange = (field: keyof PropertyInfoData, value: string) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const isEditDisabled =
    editingSection !== null && editingSection !== sectionId && !isEditable;

  return (
    <ClientThemeWrapper>
      <div
        className={`rounded-xl p-6 ${
          isEditMode ? "bg-card-open-fill" : "bg-card-close-fill"
        }`}
      >
        <form
          id={`form-${sectionId}`}
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
          className="flex flex-col gap-4"
        >
          <SectionHeader
            title="Create Settings"
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

          <PixieDropdown
            label="Portfolio"
            options={portfolioOptions}
            value={editedData.portfolioId ?? ""}
            onChange={(value) => handleInputChange("portfolioId", value)}
            isEditing={isEditMode}
            type="large"
            isRequired={true}
            placeholder="Select Portfolio"
          />

          <CustomInput
            label="Folder Name (no special characters, limit 25 characters)"
            value={editedData.folderName ?? ""}
            onChange={(value) => handleInputChange("folderName", value)}
            readOnly={!isEditMode}
            isEditing={isEditMode}
            maxCharLength={25}
            labelClassName="text-tertiary-slateBlue text-sm font-medium"
            containerClassName="w-full"
          />

          {isEditMode && (
            <div className="w-full flex flex-col gap-3">
              <PixieButton
                label="Update"
                disabled={!isEditable}
                onClick={handleUpdate}
                className="w-full"
              />
              <div className="flex justify-center">
                <LinkButton
                  onClick={handleTextClose}
                  label="Cancel"
                  disabled={!isEditable}
                />
              </div>
            </div>
          )}
        </form>
      </div>
    </ClientThemeWrapper>
  );
};

export default CreateSettingsCard;
