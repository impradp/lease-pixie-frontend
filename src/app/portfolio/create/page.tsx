"use client";

import { useState, useEffect } from "react";
import {
  samplePrimaryUsers,
  sampleSecondaryUsers,
  sampleVendors,
} from "@/data/users";
import { Locale } from "@/locales";
import { DropdownOption } from "@/types/user";
import { getMessages } from "@/locales/locale";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { Breadcrumbs } from "@/components/ui/breadcrumbs/Breadcrumbs";
import { PortfolioUsers } from "@/components/portfolio/user/PortfolioUsers";
import { PortfolioVendors } from "@/components/portfolio/vendor/PortfolioVendors";
import ConfirmationDialog from "@/components/ui/dialog/ConfirmationDialog";
import { PortfolioAutomationSync } from "@/components/portfolio/PortfolioAutomationSync";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";

export default function PortfolioPage() {
  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isSecondaryUserLocked, setIsSecondaryUserLocked] = useState(true);
  const emptyUserOption = samplePrimaryUsers.find((opt) => opt.value === "");
  const [primarySelectedUser, setPrimarySelectedUser] = useState<
    DropdownOption | undefined
  >(emptyUserOption);
  const [secondarySelectedUser, setSecondarySelectedUser] = useState<
    DropdownOption | undefined
  >(emptyUserOption);

  const emptyVendorOption = sampleVendors.find((opt) => opt.value === "");
  const [primarySelectedVendor, setPrimarySelectedVendor] = useState<
    DropdownOption | undefined
  >(emptyVendorOption);
  const [secondarySelectedVendor, setSecondarySelectedVendor] = useState<
    DropdownOption | undefined
  >(emptyVendorOption);
  const [tertiarySelectedVendor, setTertiarySelectedVendor] = useState<
    DropdownOption | undefined
  >(emptyVendorOption);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleEdit = () => {};

  const handleSubmit = () => {
    setIsPopupOpen(true);
  };

  const handlePrimaryUserChange = (user: DropdownOption) => {
    setPrimarySelectedUser(user);
    const emptyOption = sampleSecondaryUsers.find((opt) => opt.value === "");
    if (user && user.value !== "") {
      setIsSecondaryUserLocked(false);
      if (emptyOption) {
        setSecondarySelectedUser(emptyOption);
      }
    } else {
      setSecondarySelectedUser(emptyOption);
      setIsSecondaryUserLocked(true);
    }
  };

  const handlePrimaryVendorChange = (vendor: DropdownOption) => {
    setPrimarySelectedVendor(vendor);
  };

  const handleSectionEdit = (section: string) => {
    setEditingSection(section);
  };

  const handleSectionClose = () => {
    setEditingSection(null);
  };

  const breadcrumbItems = [
    { href: "/portfolio", label: "Portfolio Dashboard" },
    { href: "#", label: "Add Portfolio", isActive: true },
  ];

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      <div className="max-w-[800px] mx-auto space-y-8 py-4">
        <div className="space-y-8">
          <PortfolioCard
            portfolioName=""
            onEdit={handleEdit}
            sectionId="portfolioCard"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
          />

          <PortfolioUsers
            label={messages?.portfolio?.users?.title}
            users={samplePrimaryUsers}
            secondaryUsers={sampleSecondaryUsers}
            selectedUser={primarySelectedUser}
            selectedSecondaryUser={secondarySelectedUser}
            onUserChange={handlePrimaryUserChange}
            onSecondaryUserChange={setSecondarySelectedUser}
            sectionId="portfolioUser"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
            subLabels={[
              messages?.portfolio?.users?.primaryUserTitle,
              messages?.portfolio?.users?.secondaryUserTitle,
            ]}
            isSecondaryUserLocked={isSecondaryUserLocked}
          />

          <PortfolioVendors
            label={messages?.portfolio?.vendors?.title}
            vendors={sampleVendors}
            secondaryVendors={sampleVendors}
            tertiaryVendors={sampleVendors}
            selectedVendor={primarySelectedVendor}
            selectedSecondaryVendor={secondarySelectedVendor}
            selectedTertiaryVendor={tertiarySelectedVendor}
            onVendorChange={handlePrimaryVendorChange}
            onSecondaryVendorChange={setSecondarySelectedVendor}
            onTertiaryVendorChange={setTertiarySelectedVendor}
            sectionId="portfolioVendor"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
            subLabels={[
              messages?.portfolio?.vendors?.primaryVendorTitle,
              messages?.portfolio?.vendors?.secondaryVendorTitle,
              messages?.portfolio?.vendors?.tertiaryVendorTitle,
            ]}
            showInfo={true}
            infoContents={[
              messages?.portfolio?.vendors.primaryInfo,
              messages?.portfolio?.vendors.secondaryInfo,
              messages?.portfolio?.vendors.tertiaryInfo,
            ]}
          />

          <PortfolioAutomationSync
            label={messages?.portfolio?.automation?.title}
            title={messages?.portfolio?.automation?.syncTitle}
            info={messages?.portfolio?.automation?.info}
            sectionId="portfolioAutomationSync"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
          />
        </div>

        <div className="pt-8 flex justify-center">
          <PixieButton
            label={messages?.portfolio?.button?.label}
            disabled={false}
            onClick={handleSubmit}
            className="w-3/4"
          />
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title={messages?.portfolio?.confirmModal?.title}
        message={messages?.portfolio?.confirmModal?.message}
      />
    </>
  );
}
