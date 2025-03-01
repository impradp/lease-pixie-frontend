"use client";

import { useState } from "react";
import Link from "next/link";

import {
  samplePrimaryUsers,
  sampleSecondaryUsers,
  sampleVendorUsers,
} from "@/data/users";
import { Locale } from "@/locales";
import { DropdownOption } from "@/types/user";
import { getMessages } from "@/locales/loader";
import { ellipseCharacter } from "@/utils/textUtils";
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

  return (
    <>
      <div className="flex items-start justify-start text-xs  mb-auto">
        <div className="hidden xs:flex xs:flex-col xs:items-start xs:justify-start h-20 space-y-1px">
          <div className="text-right mb-[1px]">
            <Link href="/account/dashboard">
              <span className="text-primary-fade font-inter font-normal text-12 leading-16 hover:text-primary-regular">
                -&gt; {ellipseCharacter("Account Dashboard", 50)}
              </span>
            </Link>
          </div>
          <div className="text-right mb-[1px]">
            <span className="text-primary-regular font-inter font-normal text-12 leading-16">
              -&gt; {ellipseCharacter("Add Portfolio", 50)}
            </span>
          </div>
        </div>
        <div className="flex xs:hidden items-center justify-start w-full">
          <Link href="/account/dashboard">
            <span className="text-primary-fade font-inter font-normal text-12 leading-16 hover:text-primary-regular">
              -&gt; {ellipseCharacter("Account Dashboard", 50)}
            </span>
          </Link>
          <span className="text-primary-regular font-inter font-normal text-12 leading-16">
            -&gt; {ellipseCharacter("Add Portfolio", 50)}
          </span>
        </div>
      </div>

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
