"use client";

import React, { useState, useEffect, useContext, Suspense } from "react";
import {
  emptyUserOption,
  emptyVendorOption,
  emptySecondaryUserOption,
} from "@/data/users";
import { Locale } from "@/locales";
import { DropdownOption } from "@/types/user";
import { getMessages } from "@/locales/locale";
import {
  Portfolio,
  PortfolioUser,
  PortfolioVendorResponse,
} from "@/types/Portfolio";
import handleInfo from "@/lib/utils/errorHandler";
import { portfolioService } from "@/lib/services/portfolio";
import PixieButton from "@/components/ui/buttons/PixieButton";
import Breadcrumbs from "@/components/ui/breadcrumbs/Breadcrumbs";
import { LoadingContext } from "@/components/ClientLoadingWrapper";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { PortfolioUsers } from "@/components/portfolio/user/PortfolioUsers";
import { PortfolioVendors } from "@/components/portfolio/vendor/PortfolioVendors";
import { PortfolioAutomationSync } from "@/components/portfolio/PortfolioAutomationSync";

/**
 * Renders the content for the portfolio page
 * @returns JSX.Element - The rendered portfolio content
 */
function PortfolioContent() {
  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);
  const { setLoading, isLoading } = useContext(LoadingContext);

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isSecondaryUserLocked, setIsSecondaryUserLocked] = useState(true);
  const [portfolioName, setPortfolioName] = useState("");
  const [users, setUsers] = useState<DropdownOption[]>([emptyUserOption]);
  const [secondaryUsers, setSecondaryUsers] = useState<DropdownOption[]>([
    emptySecondaryUserOption,
  ]);
  const [vendors, setVendors] = useState<DropdownOption[]>([emptyVendorOption]);
  const [primaryUser, setPrimaryUser] =
    useState<DropdownOption>(emptyUserOption);
  const [secondaryUser, setSecondaryUser] = useState<DropdownOption>(
    emptySecondaryUserOption
  );
  const [primaryVendor, setPrimaryVendor] =
    useState<DropdownOption>(emptyVendorOption);
  const [secondaryVendor, setSecondaryVendor] =
    useState<DropdownOption>(emptyVendorOption);
  const [tertiaryVendor, setTertiaryVendor] =
    useState<DropdownOption>(emptyVendorOption);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await portfolioService.getUsers();
      if (response.status === "SUCCESS") {
        const fetchedUsers = response.data.map((user: PortfolioUser) => ({
          value: String(user.id),
          label: `${user.firstName} ${user.lastName}`,
          subLabel: user.email,
        }));
        setUsers([emptyUserOption, ...fetchedUsers]);
        setSecondaryUsers([emptySecondaryUserOption, ...fetchedUsers]);
        setPrimaryUser(emptyUserOption);
        setSecondaryUser(emptySecondaryUserOption);
      } else {
        handleInfo({ code: 100501 });
      }
    } catch (err) {
      handleInfo({ code: 100502, error: err });
      setUsers([emptyUserOption]);
      setSecondaryUsers([emptySecondaryUserOption]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await portfolioService.getVendors();
      if (response.status === "SUCCESS") {
        const fetchedVendors = response.data.map(
          (vendor: PortfolioVendorResponse["data"]) => ({
            value: String(vendor.id),
            label: vendor.companyName,
            subLabel: vendor.companyAddress,
          })
        );
        setVendors([emptyVendorOption, ...fetchedVendors]);
        setPrimaryVendor(emptyVendorOption);
        setSecondaryVendor(emptyVendorOption);
        setTertiaryVendor(emptyVendorOption);
      } else {
        handleInfo({ code: 100503 });
      }
    } catch (err) {
      handleInfo({ code: 100504, error: err });
      setVendors([emptyVendorOption]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    // Only check if required fields are empty, don't store specific errors
    const isValid = portfolioName && primaryUser.value !== "";

    return !!isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      handleInfo({ code: 100000 });
      return;
    }
    setLoading(true);
    try {
      const formData: Portfolio = {
        name: portfolioName,
        primaryUser: { id: parseInt(primaryUser.value) },
        ...(secondaryUser.value && {
          secondaryUser: { id: parseInt(secondaryUser.value) },
        }),
        ...(primaryVendor.value && {
          preferredInsuranceSeats: { id: parseInt(primaryVendor.value) },
        }),
        ...(secondaryVendor.value && {
          preferredAttorneys: { id: parseInt(secondaryVendor.value) },
        }),
        ...(tertiaryVendor.value && {
          preferredAccountingSeats: { id: parseInt(tertiaryVendor.value) },
        }),
      };

      const response = await portfolioService.create(formData);
      if (response.status === "SUCCESS") {
        handleInfo({ code: 100500 });
        setPortfolioName("");
        setPrimaryUser(emptyUserOption);
        setSecondaryUser(emptySecondaryUserOption);
        setPrimaryVendor(emptyVendorOption);
        setSecondaryVendor(emptyVendorOption);
        setTertiaryVendor(emptyVendorOption);
        setEditingSection(null);
      } else {
        handleInfo({ code: 100505 });
      }
    } catch (err) {
      handleInfo({ code: 100505, error: err });
    } finally {
      setLoading(false);
    }
  };

  const handlePrimaryUserChange = (user: DropdownOption) => {
    setPrimaryUser(user);
    setIsSecondaryUserLocked(user.value === "");
    setSecondaryUser(emptySecondaryUserOption);
  };

  const toggleEditingSection = (section: string | null) => {
    setEditingSection(section);
  };

  useEffect(() => {
    Promise.all([fetchUsers(), fetchVendors()]);
  }, []);

  const breadcrumbItems = [
    { href: "/portfolio", label: "Portfolio Dashboard" },
    { href: "#", label: "Add Portfolio", isActive: true },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="max-w-[800px] mx-auto space-y-8 py-4">
        <div className="space-y-8">
          <PortfolioCard
            portfolioName={portfolioName}
            onEdit={() => {}}
            sectionId="portfolioCard"
            editingSection={editingSection}
            onSectionEdit={toggleEditingSection}
            onSectionClose={() => toggleEditingSection(null)}
            onNameChange={setPortfolioName}
          />
          <PortfolioUsers
            label={messages?.portfolio?.users?.title}
            users={users}
            secondaryUsers={secondaryUsers}
            selectedUser={primaryUser}
            selectedSecondaryUser={secondaryUser}
            onUserChange={handlePrimaryUserChange}
            onSecondaryUserChange={setSecondaryUser}
            sectionId="portfolioUser"
            editingSection={editingSection}
            onSectionEdit={toggleEditingSection}
            onSectionClose={() => toggleEditingSection(null)}
            subLabels={[
              messages?.portfolio?.users?.primaryUserTitle,
              messages?.portfolio?.users?.secondaryUserTitle,
            ]}
            isSecondaryUserLocked={isSecondaryUserLocked}
            refreshUserList={fetchUsers}
          />
          <PortfolioVendors
            label={messages?.portfolio?.vendors?.title}
            vendors={vendors}
            secondaryVendors={vendors}
            tertiaryVendors={vendors}
            selectedVendor={primaryVendor}
            selectedSecondaryVendor={secondaryVendor}
            selectedTertiaryVendor={tertiaryVendor}
            onVendorChange={setPrimaryVendor}
            onSecondaryVendorChange={setSecondaryVendor}
            onTertiaryVendorChange={setTertiaryVendor}
            sectionId="portfolioVendor"
            editingSection={editingSection}
            onSectionEdit={toggleEditingSection}
            onSectionClose={() => toggleEditingSection(null)}
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
            refreshVendors={fetchVendors}
          />
          <PortfolioAutomationSync
            label={messages?.portfolio?.automation?.title}
            title={messages?.portfolio?.automation?.syncTitle}
            info={messages?.portfolio?.automation?.info}
            sectionId="portfolioAutomationSync"
            editingSection={editingSection}
            onSectionEdit={toggleEditingSection}
            onSectionClose={() => toggleEditingSection(null)}
          />
        </div>
        <div className="pt-8 flex justify-center">
          <PixieButton
            label={messages?.portfolio?.button?.label}
            disabled={isLoading}
            onClick={handleSubmit}
            className="w-3/4"
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}

/**
 * Renders the portfolio page with suspense fallback
 * @returns JSX.Element - The rendered portfolio page
 */
const PortfolioPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <PortfolioContent />
    </Suspense>
  );
};

export default PortfolioPage;
