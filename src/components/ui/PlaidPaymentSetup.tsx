import React, { useState, useEffect } from "react";
import PixieButton from "@/components/ui/buttons/PixieButton";
import LinkButton from "@/components/ui/buttons/LinkButton";
import { SectionHeader } from "@/components/ui/header/SectionHeader";
import { Info } from "lucide-react";

interface PlaidPaymentSetupProps {
  onClose?: () => void;
  onRemoveLink?: () => void;
  onSubmit: (setLoading: (loading: boolean) => void) => Promise<void>;
  canRemoveLink?: boolean;
}

const PlaidPaymentSetup: React.FC<PlaidPaymentSetupProps> = ({
  onClose,
  onSubmit,
  canRemoveLink = false,
  onRemoveLink,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const originalPadding = window.getComputedStyle(document.body).paddingRight;

    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.paddingRight = originalPadding;
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      onSubmit(setIsLoading);
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[360px] h-[608px] max-w-lg mx-4 p-6 flex flex-col gap-4">
        <SectionHeader
          title="Set Payment Method"
          showCloseButton={true}
          onClose={onClose}
        />

        <div className="bg-[#f4f5f7] rounded-lg p-3 outline outline-1 outline-[#cfd4dc] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
          <div className="flex items-center gap-2 mb-1">
            <Info size={20} className="text-icon-info" />
            <span className="text-[#101828] text-xs font-medium font-['Inter'] leading-tight">
              Instructions
            </span>
          </div>
          <div className="text-[#0f1728] text-xs font-normal font-['Inter'] leading-[18px]">
            <p className="mb-2">
              We use Plaid services to communicate with your bank to retrieve
              your checking and routing numbers without the need for us to store
              that information for added security. Plaid is a separate
              third-party service with separate{" "}
              <span className="underline">Terms of Service</span> and{" "}
              <span className="underline">Privacy Policy</span>.
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Verify your bank account access via Plaid link.</li>
              <li>
                Select an account to retrieve its account and routing number to
                make payments from your dashboard.
              </li>
              <li>
                After your account and routing numbers are shared, you can
                select an optional auto-pay feature to automatically start to
                process your payment three days prior to your due date to avoid
                late fees.
              </li>
              <li>
                Alternatively, you may manually process payments by pressing the
                “Pay Now” button from your invoice page.
              </li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <PixieButton
            label="Continue to Plaid"
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            className="w-full px-3.5 py-2.5 bg-black rounded text-white text-sm font-semibold font-['Inter'] leading-tight shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] outline outline-2 outline-offset-[-2px] outline-white/10"
          />
          <div className="flex justify-center">
            <LinkButton
              onClick={() =>
                canRemoveLink
                  ? onRemoveLink && onRemoveLink()
                  : onClose && onClose()
              }
              label={canRemoveLink ? "Remove Plaid Link" : "Cancel"}
              className="text-[#475466] text-sm font-semibold font-['Inter'] underline leading-tight"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaidPaymentSetup;
