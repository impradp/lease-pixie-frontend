"use client";

import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs/Breadcrumbs";
import PixieButton from "@/components/ui/buttons/PixieButton";

export default function PortfolioPage() {
  const router = useRouter();

  const handleSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
    router.push("/portfolio/create");
  };

  const breadcrumbItems = [
    { href: "", label: "Portfolio Dashboard", isActive: true },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      <div className="m-full flex flex-col  h-[1280px] max-w-[800px] justify-center mx-auto space-y-8 py-4">
        <div className=" h-[480px] pt-8 flex   justify-center">
          <PixieButton
            label={"Add Portfolio"}
            disabled={false}
            onClick={handleSubmit}
            className="w-1/3"
          />
        </div>
      </div>
    </>
  );
}
