"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import SidebarMenu from "@/components/ui/menus/SidebarMenu";
import OptimizedSvgImage from "@/components/ui/OptimizedSvgImage";

interface PixieNavbarProps {
  className?: string;
}

const PixieNavbar: React.FC<PixieNavbarProps> = ({ className = "" }) => {
  const pathname = usePathname();

  const hasHamburgerEnabled = !pathname?.includes("/login");
  const isLoginPage = pathname?.includes("/login");

  const loginClassName = isLoginPage ? "mb-[33px]" : "";

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleMenuToggle = (): void => {
    if (hasHamburgerEnabled) {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  return (
    <div className={`w-full ${loginClassName}`}>
      <div className={`w-full ${className} flex flex-col`}>
        <div className="flex justify-start items-center">
          <div className="relative w-fit">
            <div className="flex flex-row items-center mb-[8px]">
              <div
                className={`mr-3 hover:opacity-100 transition-opacity duration-300 ${
                  isMenuOpen ? "!opacity-100" : ""
                } ${
                  hasHamburgerEnabled
                    ? "pulse-transparency cursor-pointer"
                    : "opacity-60"
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
