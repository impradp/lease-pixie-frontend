"use client";

import { useState, Suspense, useContext, useCallback, useEffect } from "react";

import Breadcrumbs from "@/components/ui/breadcrumbs/Breadcrumbs";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";
import ClientPaymentProcessorCard from "@/components/settings/system-tables/ClientPaymentProcessorCard";
import { LoadingContext } from "@/components/ClientLoadingWrapper";
import { hasRole } from "@/lib/utils/authUtils";
import PlatformInvoicingCard from "@/components/settings/system-tables/PlatformInvoicingCard";
import AISettingsCard from "@/components/settings/system-tables/AISettingsCard";

/**
 * Renders the content for the vendors page
 * @returns JSX.Element - The rendered vendors content
 */
const SystemTablesContent: React.FC = () => {
  const { isLoading, setLoading } = useContext(LoadingContext);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isReadonly, setIsReadonly] = useState(false);

  const isSubmitting = useCallback(
    (value: boolean) => setLoading(value),
    [setLoading]
  );

  useEffect(() => {
    setIsReadonly(!hasRole("ADMINUSER"));
  }, []);

  // Handle section edit state
  const handleSectionEdit = (section: string) => {
    setEditingSection(section);
  };

  // Close editing section
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
      </div>
    </>
  );
};

/**
 * Renders the vendors page with suspense fallback
 * @returns JSX.Element - The rendered vendors page
 */
const SystemTablesPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <SystemTablesContent />
    </Suspense>
  );
};

export default SystemTablesPage;
