"use client";

import { useState } from "react";

import {
  samplePrimaryUsers,
  sampleSecondaryUsers,
  sampleVendorUsers,
} from "@/data/users";
import { Locale } from "@/locales";
import { DropdownOption } from "@/types/user";
import { getMessages } from "@/locales/loader";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import PixieButton from "@/components/buttons/PixieButton";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { PortfolioUser } from "@/components/portfolio/PortfolioUser";
import ConfirmationDialog from "@/components/popups/ConfirmationDialog";

export default function PortfolioPage() {
  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);

  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isSecondaryUserLocked, setIsSecondaryUserLocked] = useState(true);
  const [isSecondaryVendorLocked, setIsSecondaryVendorLocked] = useState(true);
  const [isTertiaryVendorLocked, setIsTertiaryVendorLocked] = useState(true);
  const [primarySelectedUser, setPrimarySelectedUser] = useState<
    DropdownOption | undefined
  >();
  const [secondarySelectedUser, setSecondarySelectedUser] = useState<
    DropdownOption | undefined
  >();
  const [primarySelectedVendor, setPrimarySelectedVendor] = useState<
    DropdownOption | undefined
  >();
  const [secondarySelectedVendor, setSecondarySelectedVendor] = useState<
    DropdownOption | undefined
  >();
  const [tertiarySelectedVendor, setTertiarySelectedVendor] = useState<
    DropdownOption | undefined
  >();

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = () => {
    setIsPopupOpen(true);
  };

  const handlePrimaryUserChange = (user: DropdownOption) => {
    setPrimarySelectedUser(user);
    if (user && user.value !== "") {
      setIsSecondaryUserLocked(false);
      const emptyOption = sampleSecondaryUsers.find((opt) => opt.value === "");
      if (emptyOption) {
        setSecondarySelectedUser(emptyOption);
      }
    }
  };

  const handlePrimaryVendorChange = (user: DropdownOption) => {
    setPrimarySelectedVendor(user);
    if (user && user.value !== "") {
      setIsSecondaryVendorLocked(false);
      setIsTertiaryVendorLocked(false);
      const emptyOption = sampleVendorUsers.find((opt) => opt.value === "");
      if (emptyOption) {
        setSecondarySelectedVendor(emptyOption);
        setTertiarySelectedVendor(emptyOption);
      }
    }
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

          <PortfolioUser
            label={messages?.portfolio?.user?.title}
            users={samplePrimaryUsers}
            selectedUser={primarySelectedUser}
            onUserChange={handlePrimaryUserChange}
            isLocked={false}
            sectionId="primaryUser" // Unique identifier for this section
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
          />

          <PortfolioUser
            label={messages?.portfolio?.user?.titleSecondary}
            users={sampleSecondaryUsers}
            selectedUser={secondarySelectedUser}
            onUserChange={isEditing ? setSecondarySelectedUser : undefined}
            isLocked={isSecondaryUserLocked}
            lockMessage={"Secondary user is not active"}
            sectionId="secondaryUser"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
          />

          <PortfolioUser
            label={messages?.portfolio?.vendor?.title}
            users={sampleVendorUsers}
            selectedUser={primarySelectedVendor}
            onUserChange={handlePrimaryVendorChange}
            showInfo={true}
            userType="Vendor"
            infoContent={messages?.portfolio?.vendor?.primaryInfo}
            isLocked={false}
            sectionId="primaryVendor"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
          />

          <PortfolioUser
            label={messages?.portfolio?.vendor?.titleSecondary}
            users={sampleVendorUsers}
            selectedUser={secondarySelectedVendor}
            onUserChange={setSecondarySelectedVendor}
            showInfo={true}
            userType="Vendor"
            infoContent={messages?.portfolio?.vendor?.secondaryInfo}
            isLocked={isSecondaryVendorLocked}
            lockMessage={"Seat not active"}
            sectionId="secondaryVendor"
            editingSection={editingSection}
            onSectionEdit={handleSectionEdit}
            onSectionClose={handleSectionClose}
          />

          <PortfolioUser
            label={messages?.portfolio?.vendor?.titleTertiary}
            users={sampleVendorUsers}
            selectedUser={tertiarySelectedVendor}
            onUserChange={setTertiarySelectedVendor}
            showInfo={true}
            userType="Vendor"
            infoContent={messages?.portfolio?.vendor?.tertiaryInfo}
            isLocked={isTertiaryVendorLocked}
            lockMessage={"Seat not active"}
            sectionId="tertiaryVendor"
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
