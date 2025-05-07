"use client";

import { useState, Suspense, useContext, useCallback, useEffect } from "react";

import { hasRole } from "@/lib/utils/authUtils";
import Breadcrumbs from "@/components/ui/breadcrumbs/Breadcrumbs";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";
import { LoadingContext } from "@/components/ClientLoadingWrapper";
import CostsCard from "@/components/settings/system-tables/CostsCard";
import AISettingsCard from "@/components/settings/system-tables/AISettingsCard";
import PlatformInvoicingCard from "@/components/settings/system-tables/PlatformInvoicingCard";
import ClientPaymentProcessorCard from "@/components/settings/system-tables/ClientPaymentProcessorCard";

/**
 * Renders the content for the system tables page, displaying various settings cards.
 *
 * @returns JSX.Element - The rendered system tables content.
 */
const SystemTablesContent: React.FC = () => {
  const { isLoading, setLoading } = useContext(LoadingContext);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isReadonly, setIsReadonly] = useState(false);

  /**
   * Updates the loading state in the LoadingContext.
   *
   * @param value - The boolean value to set the loading state.
   */
  const isSubmitting = useCallback(
    (value: boolean) => setLoading(value),
    [setLoading]
  );

  /**
   * Sets the readonly state based on whether the user has the ADMINUSER role.
   */
  useEffect(() => {
    setIsReadonly(!hasRole("ADMINUSER"));
  }, []);

  /**
   * Sets the currently editing section.
   *
   * @param section - The name of the section to set as editing.
   */
  const handleSectionEdit = (section: string) => {
    setEditingSection(section);
  };

  /**
   * Closes the currently editing section, resetting the state.
   */
  const handleSectionClose = () => {
    setEditingSection(null);
  };

  const breadcrumbItems = [
    { href: "/dashboard", label: "Admin Dashboard" },
    { href: "#", label: "System Tables", isActive: true },
  ];

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="max-w-[800px] mx-auto space-y-8 py-4">
        <ClientPaymentProcessorCard
          sectionName="payment-processor"
          editingSection={editingSection}
          onSectionEdit={handleSectionEdit}
          onSectionClose={handleSectionClose}
          isSubmitting={isSubmitting}
          isEditable={!isLoading && !isReadonly}
        />
        <PlatformInvoicingCard
          sectionName="platform-invoicing"
          editingSection={editingSection}
          onSectionEdit={handleSectionEdit}
          onSectionClose={handleSectionClose}
          isSubmitting={isSubmitting}
          isEditable={!isLoading && !isReadonly}
        />
        <AISettingsCard
          sectionName="ai-settings"
          editingSection={editingSection}
          onSectionEdit={handleSectionEdit}
          onSectionClose={handleSectionClose}
          isSubmitting={isSubmitting}
          isEditable={!isLoading && !isReadonly}
        />

        <CostsCard
          sectionName="ai-costs"
          editingSection={editingSection}
          onSectionEdit={handleSectionEdit}
          onSectionClose={handleSectionClose}
          isSubmitting={isSubmitting}
          isEditable={!isLoading && !isReadonly}
        />
      </div>
    </>
  );
};

/**
 * Renders the system tables page with a suspense fallback for loading states.
 *
 * @returns JSX.Element - The rendered system tables page.
 */
const SystemTablesPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <SystemTablesContent />
    </Suspense>
  );
};

export default SystemTablesPage;
