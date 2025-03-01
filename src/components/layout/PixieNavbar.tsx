"use client";

import React, { useState } from "react";
import SidebarMenu from "@/components/menus/SidebarMenu";
import OptimizedSvgImage from "@/components/ui/OptimizedSvgImage";

const PixieNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleMenuToggle = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full">
      <div className="max-w-[1180px] mx-auto px-1 flex flex-col">
        <div className="flex justify-start items-center">
          <div className="relative w-fit">
            <div className="flex flex-row items-center mb-[8px]">
              <div
                className={`mr-3 hover:opacity-100 cursor-pointer pulse-transparency transition-opacity duration-300 ${
                  isMenuOpen ? "!opacity-100" : ""
                }`}
                onClick={handleMenuToggle}
              >
                <OptimizedSvgImage
                  src="/icons/leasepixie-icon.svg"
                  alt="Primary Icon"
                  width={24}
                  height={24}
                  className="object-contain ml-[12px] mt-[12px]"
                  priority
                />
              </div>
              <div className="flex flex-row items-center opacity-60 hover:opacity-100">
                <OptimizedSvgImage
                  src="/icons/leasepixie-icon-char.svg"
                  alt="Logo"
                  width={103}
                  height={26}
                  className="object-contain mt-5"
                  priority
                />
              </div>
            </div>
            <SidebarMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixieNavbar;
