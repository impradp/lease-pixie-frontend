"use client";

import { useState, useEffect } from "react";
import { ToastrMessage } from "@/types/ToastrMessage";
import Toastr from "@/components/ui/toastrPopup/Toastr";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";
import { Breadcrumbs } from "@/components/ui/breadcrumbs/Breadcrumbs";
import SpaceSettingsCard from "@/components/property/SpaceSettingsCard";

export default function PropertyPage() {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [toastrs, setToastrs] = useState<ToastrMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleEdit = () => {};

  const handleSectionEdit = (section: string) => {
    setEditingSection(section);
  };

  const handleSectionClose = () => {
    setSelectedFile(null);
    setEditingSection(null);
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    const validExtensions = [".xls", ".xlsx"];
    const fileExtension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      const toastrId = `toastr-${Date.now()}-${Math.random()}`;
      setToastrs((prev) => [
        ...prev,
        {
          id: toastrId,
          message: "Invalid file type. Please select an XLS or XLSX file.",
          toastrType: "warning",
        },
      ]);
      return;
    }

    // Validate file size
    if (file.size <= 10 * 1024 * 1024) {
      setSelectedFile(file);
    } else {
      const toastrId = `toastr-${Date.now()}-${Math.random()}`;
      setToastrs((prev) => [
        ...prev,
        {
          id: toastrId,
          message: "File size exceeds 10MB limit",
          toastrType: "warning",
        },
      ]);
    }
  };

  // TODO: Handle file upload
  const handleSpaceSettingUpdate = () => {
    console.log("File uploaded", selectedFile);
  };

  const handleToastrClose = (id: string) => {
    setToastrs((prev) => prev.filter((toastr) => toastr.id !== id));
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const breadcrumbItems = [
    { href: "/admin", label: "Admin Dashboard" },
    { href: "#", label: "Add Property", isActive: true },
  ];

  if (isLoading) {
    return <LoadingOverlay size={40} />;
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      <div className="max-w-[800px] mx-auto space-y-8 py-4">
        {toastrs.length > 0 && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 xs:right-4 xs:left-auto xs:translate-x-0 z-50 flex flex-col gap-2">
            {toastrs.map((toastr) => (
              <Toastr
                key={toastr.id}
                message={toastr.message}
                toastrType={toastr.toastrType}
                onClose={() => handleToastrClose(toastr.id)}
              />
            ))}
          </div>
        )}
        <div className="space-y-8">
          <SpaceSettingsCard
            onEdit={handleEdit}
            sectionId="propertySettingsCard"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
            showInfo={true}
            workingTemplateLink={"www.google.com"}
            instructionalTemplateLink={"www.google.com"}
            downloadInfoContent="Download Property Info: Sample Property Info here."
            uploadInfoContent="Upload Property Info: Sample Property Info here."
            onFileSelect={handleFileSelect}
            handleSpaceSettingUpdate={handleSpaceSettingUpdate}
          />
        </div>
      </div>
    </>
  );
}
