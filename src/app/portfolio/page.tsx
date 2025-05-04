"use client";

import React, {
  useState,
  useEffect,
  useContext,
  Suspense,
  useCallback,
} from "react";
import {
  emptyUserOption,
  emptyVendorOption,
  emptySecondaryUserOption,
} from "@/data/users";

import {
  Portfolio,
  PortfolioUser,
  PortfolioVendorResponse,
} from "@/types/Portfolio";
import { Locale } from "@/locales";
import handleToast from "@/lib/utils/toastr";
import { DropdownOption } from "@/types/user";
import { getMessages } from "@/locales/locale";
import { hasRole } from "@/lib/utils/authUtils";
import handleInfo from "@/lib/utils/errorHandler";
import { getDefaultPage } from "@/config/roleAccess";
import { accountService } from "@/lib/services/account";
import { portfolioService } from "@/lib/services/portfolio";
import { useRouter, useSearchParams } from "next/navigation";
import PixieButton from "@/components/ui/buttons/PixieButton";
import Breadcrumbs from "@/components/ui/breadcrumbs/Breadcrumbs";
import { LoadingContext } from "@/components/ClientLoadingWrapper";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { PortfolioUsers } from "@/components/portfolio/user/PortfolioUsers";
import { PortfolioVendors } from "@/components/portfolio/vendor/PortfolioVendors";
import { PortfolioAutomationSync } from "@/components/portfolio/PortfolioAutomationSync";
import { sanitizeUrl } from "@/lib/utils/browserUtils";

/**
 * Renders the content for the portfolio page
 * @returns JSX.Element - The rendered portfolio content
 */
function PortfolioContent() {
  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);
  const searchParams = useSearchParams();
  const router = useRouter();
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
  const [isReadonly, setIsReadonly] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio>();
  const [isVendorListLoaded, setIsVendorListLoaded] = useState(false);

  /**
   * Fetches portfolio details by ID
   * @param id - The portfolio ID
   */
  const fetchPortfolioDetails = useCallback(
    async (id?: string) => {
      if (!isVendorListLoaded) return; // Wait until vendors are loaded

      setLoading(true);
      try {
        if (id) {
          const portfolioDetails = await portfolioService.fetchById(id);
          if (portfolioDetails?.status === "SUCCESS") {
            const portfolio = portfolioDetails.data;
            setSelectedPortfolio(portfolio);
            setPortfolioName(portfolio.name);
            if (portfolio?.primaryUser) {
              setPrimaryUser({
                label:
                  portfolio?.primaryUser?.firstName +
                  " " +
                  portfolio?.primaryUser?.lastName,
                value: String(portfolio?.primaryUser?.id),
                subLabel: portfolio?.primaryUser?.email,
              });
            } else {
              setPrimaryUser(emptyUserOption);
            }

            if (portfolio?.secondaryUser) {
              const secondary = {
                label:
                  portfolio?.secondaryUser?.firstName +
                  " " +
                  portfolio?.secondaryUser?.lastName,
                value: String(portfolio?.secondaryUser?.id),
                subLabel: portfolio?.secondaryUser?.email,
              };
              setSecondaryUser(secondary);
            } else {
              setSecondaryUser(emptySecondaryUserOption);
            }

            if (portfolio?.preferredInsuranceSeats) {
              const primary = {
                label: portfolio?.preferredInsuranceSeats?.companyName ?? "",
                value: String(portfolio?.preferredInsuranceSeats?.id),
                subLabel:
                  portfolio?.preferredInsuranceSeats?.companyAddress ?? "",
              };
              setPrimaryVendor(primary);
            } else {
              setPrimaryVendor(emptyVendorOption);
            }

            if (portfolio?.preferredAttorneys) {
              const secondary = {
                label: portfolio?.preferredAttorneys?.companyName ?? "",
                value: String(portfolio?.preferredAttorneys?.id),
                subLabel: portfolio?.preferredAttorneys?.companyAddress ?? "",
              };
              setSecondaryVendor(secondary);
            } else {
              setSecondaryVendor(emptyVendorOption);
            }

            if (portfolio?.preferredAccountingSeats) {
              const tertiary = {
                label: portfolio?.preferredAccountingSeats?.companyName ?? "",
                value: String(portfolio?.preferredAccountingSeats?.id),
                subLabel:
                  portfolio?.preferredAccountingSeats?.companyAddress ?? "",
              };
              setTertiaryVendor(tertiary);
            } else {
              setTertiaryVendor(emptyVendorOption);
            }

            // Update URL if necessary
            const currentUrl = `/portfolio?id=${id}`;
            if (
              window.location.pathname + window.location.search !==
              currentUrl
            ) {
              sanitizeUrl(currentUrl, undefined);
            }
          } else {
            router.push(getDefaultPage() + "?msg=100101");
          }
        }
      } catch {
        router.push(getDefaultPage() + "?msg=100101");
      } finally {
        setLoading(false);
      }
    },
    [router, setLoading, isVendorListLoaded]
  );

  useEffect(() => {
    setIsReadonly(hasRole("READONLYADMINUSER"));
    handleToast(searchParams);
    const id = searchParams.get("id") ?? undefined;
    if (id && isVendorListLoaded) {
      fetchPortfolioDetails(id);
    }
  }, [searchParams, fetchPortfolioDetails, isVendorListLoaded]);

  /**
   * Fetches list of users
   */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await accountService.fetchPortfolioUsers({
        attachPortfolio: false,
      });
      if (response.status === "SUCCESS") {
        const fetchedUsers = response.data.map((user: PortfolioUser) => ({
          value: String(user.id),
          label: `${user.firstName} ${user.lastName}`,
          subLabel: user.email,
        }));
        setUsers([emptyUserOption, ...fetchedUsers]);
        setSecondaryUsers([emptySecondaryUserOption, ...fetchedUsers]);
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

  /**
   * Fetches list of vendors
   */
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
        setIsVendorListLoaded(true); // Mark vendors as loaded
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

  /**
   * Validates the portfolio form
   * @returns boolean - Whether the form is valid
   */
  const validateForm = (): boolean => {
    return !!portfolioName && primaryUser.value !== "";
  };

  /**
   * Handles form submission to create a portfolio
   */
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
        router.push(getDefaultPage() + "?msg=100500");
      } else {
        handleInfo({ code: 100505 });
        setLoading(false);
      }
    } catch (err) {
      handleInfo({ code: 100506, error: err });
      setLoading(false);
    }
  };

  const handleUpdate = async (portfolioId: number) => {
    if (!validateForm()) {
      handleInfo({ code: 100000 });
      return;
    }
    setLoading(true);
    try {
      const formData: Portfolio = {
        id: portfolioId,
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

      const response = await portfolioService.update(portfolioId, formData);
      if (response.status === "SUCCESS") {
        router.push(getDefaultPage() + "?msg=100521");
      } else {
        handleInfo({ code: 100522 });
        setLoading(false);
      }
    } catch (err) {
      handleInfo({ code: 100523, error: err });
      setLoading(false);
    }
  };

  /**
   * Handles primary user change and locks/unlocks secondary user
   * @param user - The selected primary user
   */
  const handlePrimaryUserChange = (user: DropdownOption) => {
    setPrimaryUser(user);
    setIsSecondaryUserLocked(user.value === "");
    setSecondaryUser(emptySecondaryUserOption);
  };

  /**
   * Toggles the editing section
   * @param section - The section to edit or null to close
   */
  const toggleEditingSection = (section: string | null): void => {
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
          {selectedPortfolio?.id ? (
            <PixieButton
              label={"Update Portfolio"}
              disabled={isLoading || isReadonly}
              onClick={() =>
                selectedPortfolio?.id && handleUpdate(selectedPortfolio?.id)
              }
              className="w-2/3"
              isLoading={isLoading}
            />
          ) : (
            <PixieButton
              label={messages?.portfolio?.button?.label}
              disabled={isLoading || isReadonly}
              onClick={handleSubmit}
              className="w-2/3"
              isLoading={isLoading}
            />
          )}
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
