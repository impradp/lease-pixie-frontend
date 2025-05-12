import React, { useState, useEffect } from "react";
import { Download, Upload } from "lucide-react";
import SubHeader from "@/components/ui/header/SubHeader";
import PixieButton from "@/components/ui/buttons/PixieButton";
import LinkButton from "@/components/ui/buttons/LinkButton";
import SectionHeader from "@/components/ui/header/SectionHeader";
import { hasRole } from "@/lib/utils/authUtils";

interface SpaceSettingsCardProps {
  onEdit?: () => void;
  sectionId: string;
  editingSection: string | null;
  onSectionEdit: (section: string) => void;
  handleSpaceSettingUpdate: () => void;
  onSectionClose: () => void;
  showInfo?: boolean;
  downloadInfoContent?: string;
  uploadInfoContent?: string;
  onFileSelect: (file: File | null) => void;
  workingTemplateLink: string;
  instructionalTemplateLink: string;
}

const SpaceSettingsCard: React.FC<SpaceSettingsCardProps> = ({
  onEdit,
  sectionId,
  editingSection,
  onSectionEdit,
  onSectionClose,
  showInfo = false,
  downloadInfoContent = "",
  uploadInfoContent = "",
  onFileSelect,
  workingTemplateLink,
  instructionalTemplateLink,
  handleSpaceSettingUpdate,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [portfolioUserAccess, setPortfolioUserAccess] = useState(false);

  const hasAccountUserAccess = hasRole("AccountUser");

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
    setIsEditMode(false);
    onSectionClose();
  };

  const handleUpdate = () => {
    setIsEditMode(false);
    handleSpaceSettingUpdate();
    onSectionClose();
  };

  const handleUploadClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xls,.xlsx";
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      onFileSelect(files && files.length > 0 ? files[0] : null);
    };
    input.click();
  };

  // Ensure the link is absolute by adding a protocol if missing
  const ensureAbsoluteUrl = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };

  const isEditDisabled =
    editingSection !== null && editingSection !== sectionId;

  return (
    <div
      className={`flex items-center rounded-xl p-6 flex flex-col gap-4 ${
        isEditMode ? "bg-card-open-fill" : "bg-card-close-fill"
      }`}
    >
      <SectionHeader
        title={"Space Settings"}
        onEdit={handleEdit}
        onTextCancel={handleTextClose}
        onAccessToggle={(newAccess) => setPortfolioUserAccess(newAccess)}
        showEditButton={!isEditMode}
        showTextCloseButton={isEditMode}
        editDisabled={isEditDisabled}
        cardActionContent="Portfolio User %s Edit"
        hasAccess={portfolioUserAccess}
        showCardActionContent={hasAccountUserAccess}
      />

      <SubHeader
        label="Step 1: Download space template"
        showInfo={showInfo}
        infoContent={downloadInfoContent}
      />
      <div className="flex w-[348px] flex-col items-center justify-center gap-4 py-2">
        <div className="relative h-12 w-12 overflow-hidden">
          <Download className="absolute left-[6px] top-[6px] h-9 w-9 text-tertiary-darkGray" />
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex items-start justify-center gap-1">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <a
                href={ensureAbsoluteUrl(workingTemplateLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold leading-tight text-tertiary-light underline"
              >
                Working template
              </a>
            </div>
          </div>
          <div className="flex items-start justify-center gap-1">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <a
                href={ensureAbsoluteUrl(instructionalTemplateLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold leading-tight text-tertiary-light underline"
              >
                Instructional template
              </a>
            </div>
          </div>
          <div className="text-xs font-normal leading-tight text-tertiary-slateBlue">
            Format file XLS
          </div>
        </div>
      </div>

      <SubHeader
        label="Step 2: Upload edited space template"
        showInfo={showInfo}
        infoContent={uploadInfoContent}
      />
      <div className="flex w-[348px] flex-col items-center justify-center gap-4 py-2">
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
                Upload
              </button>
            </div>
          </div>
          <div className="text-xs font-normal leading-tight text-tertiary-slateBlue">
            Format file XLS (max 10MB)
          </div>
        </div>
      </div>

      {isEditMode && (
        <div className="w-full flex flex-col gap-3">
          <PixieButton
            label="Continue"
            disabled={false}
            onClick={handleUpdate}
            className="w-full"
          />
          <div className="flex justify-center">
            <LinkButton onClick={handleTextClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceSettingsCard;
