"use client";

import { useState } from "react";
import {
  samplePrimaryUsers,
  sampleSecondaryUsers,
  sampleVendors,
} from "@/data/users";
import { Locale } from "@/locales";
import { DropdownOption } from "@/types/user";
import { getMessages } from "@/locales/loader";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import PixieButton from "@/components/buttons/PixieButton";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { PortfolioUsers } from "@/components/portfolio/PortfolioUsers";
import ConfirmationDialog from "@/components/popups/ConfirmationDialog";
import { PortfolioVendors } from "@/components/portfolio/PortfolioVendors";
import { PortfolioAutomationSync } from "@/components/portfolio/PortfolioAutomationSync";

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
    { href: "/account/dashboard", label: "Account Dashboard" },
    { href: "/portfolio/create", label: "Add Portfolio" },
    {
      href: "",
      label: "Sync Settings For Portfolio #1 With Property #1",
      isActive: true,
    },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      <div className="max-w-[800px] mt-10 mx-auto space-y-8">
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
