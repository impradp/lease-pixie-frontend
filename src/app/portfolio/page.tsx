"use client";

import { useState, useEffect, useContext, useCallback } from "react";

import {
  emptyUserOption,
  emptyVendorOption,
  emptySecondaryUserOption,
} from "@/data/users";
import { Locale } from "@/locales";
import toastr from "@/lib/func/toastr";
import { DropdownOption } from "@/types/user";
import { getMessages } from "@/locales/locale";
import {
  PortfolioDto,
  PortfolioUserResponse,
  PortfolioVendorResponse,
} from "@/types/Portfolio";
import handleError from "@/lib/utils/errorHandler";
import { portfolioService } from "@/lib/services/portfolio";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { LoadingContext } from "@/components/ClientLoadingWrapper";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import Breadcrumbs from "@/components/ui/breadcrumbs/Breadcrumbs";
import { PortfolioUsers } from "@/components/portfolio/user/PortfolioUsers";
import { PortfolioVendors } from "@/components/portfolio/vendor/PortfolioVendors";
import { PortfolioAutomationSync } from "@/components/portfolio/PortfolioAutomationSync";

export default function PortfolioPage() {
  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);
  const { setLoading, isLoading } = useContext(LoadingContext);

  // State management
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isSecondaryUserLocked, setIsSecondaryUserLocked] = useState(true);
  const [portfolioName, setPortfolioName] = useState("");

  // Dropdown options
  const [users, setUsers] = useState<DropdownOption[]>([emptyUserOption]);
  const [secondaryUsers, setSecondaryUsers] = useState<DropdownOption[]>([
    emptySecondaryUserOption,
  ]);
  const [vendors, setVendors] = useState<DropdownOption[]>([emptyVendorOption]);

  // Selected values
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

  // Memoized fetch functions
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await portfolioService.getUsers();
      if (response.status === "SUCCESS") {
        const fetchedUsers = response.data.map(
          (user: PortfolioUserResponse["data"]) => ({
            value: String(user.id),
            label: `${user.firstName} ${user.lastName}`,
            subLabel: user.email,
          })
        );
        setUsers([emptyUserOption, ...fetchedUsers]);
        setSecondaryUsers([emptySecondaryUserOption, ...fetchedUsers]);
        setPrimaryUser(emptyUserOption);
        setSecondaryUser(emptySecondaryUserOption);
      } else {
        handleError({
          message: "Error fetching portfolio users",
        });
      }
    } catch (error) {
      handleError({
        message: "Exception occurred while fetching portfolio users",
        error,
      });
      setUsers([emptyUserOption]);
      setSecondaryUsers([emptySecondaryUserOption]);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const fetchVendors = useCallback(async () => {
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
        handleError({
          message: "Error fetching portfolio vendors",
        });
      }
    } catch (error) {
      handleError({
        message: "Exception occurred while fetching portfolio vendors",
        error,
      });
      setVendors([emptyVendorOption]);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  // Form submission
  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const formData: PortfolioDto = {
        name: portfolioName,
        primaryUser: { id: parseInt(primaryUser.value) },
        secondaryUser: secondaryUser.value
          ? { id: parseInt(secondaryUser.value) }
          : {},
        preferredInsuranceSeats: primaryVendor.value
          ? { id: parseInt(primaryVendor.value) }
          : {},
        preferredAttorneys: secondaryVendor.value
          ? { id: parseInt(secondaryVendor.value) }
          : {},
        preferredAccountingSeats: tertiaryVendor.value
          ? { id: parseInt(tertiaryVendor.value) }
          : {},
      };

      const response = await portfolioService.create(formData);
      if (response.status == "SUCCESS") {
        toastr({
          message: "Portfolio created successfully.",
          toastrType: "success",
        });
        setPortfolioName("");
        setPrimaryUser(emptyUserOption);
        setSecondaryUser(emptySecondaryUserOption);
        setPrimaryVendor(emptyVendorOption);
        setSecondaryVendor(emptyVendorOption);
        setTertiaryVendor(emptyVendorOption);
        setEditingSection(null);
      } else {
        handleError({
          message: "Error creating portfolio",
        });
      }
    } catch (error) {
      handleError({
        message: "Exception occurred while creating portfolio",
        error,
      });
    } finally {
      setLoading(false);
    }
  }, [
    portfolioName,
    primaryUser,
    secondaryUser,
    primaryVendor,
    secondaryVendor,
    tertiaryVendor,
    setLoading,
  ]);

  // Event handlers
  const handlePrimaryUserChange = useCallback((user: DropdownOption) => {
    setPrimaryUser(user);
    setIsSecondaryUserLocked(user.value === "");
    setSecondaryUser(emptySecondaryUserOption);
  }, []);

  const toggleEditingSection = useCallback((section: string | null) => {
    setEditingSection(section);
  }, []);

  // Initial data fetch
  useEffect(() => {
    Promise.all([fetchUsers(), fetchVendors()]);
  }, [fetchUsers, fetchVendors]);

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
