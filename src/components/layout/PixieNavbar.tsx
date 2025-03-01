"use client";

import React, { useState } from "react";
import SidebarMenu from "@/components/menus/SidebarMenu";
import OptimizedSvgImage from "@/components/ui/OptimizedSvgImage";

const PixieNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [animationCompleted, setAnimationCompleted] = useState<boolean>(false);

  const handleMenuToggle = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAnimationEnd = (): void => {
    setAnimationCompleted(true);
  };

  return (
    <div className="w-full pt-4">
      <div className="max-w-[1180px] mx-auto px-1 flex flex-col">
        <div className="flex justify-end items-center">
          <div className="relative w-fit">
            <div className="flex flex-row items-center">
              <div
                className={`mr-3 hover:opacity-100 cursor-pointer ${
                  !animationCompleted
                    ? "opacity-fade"
                    : isMenuOpen
                    ? "opacity-100"
                    : "opacity-60"
                } transition-opacity duration-300 ${
                  isMenuOpen ? "opacity-60" : ""
                }`}
                onClick={handleMenuToggle}
                onAnimationEnd={handleAnimationEnd}
              >
                <OptimizedSvgImage
                  src="/icons/leasepixie-icon.svg"
                  alt="Primary Icon"
                  width={28}
                  height={30}
                  className="object-contain mb-2 "
                  priority
                />
              </div>
              <div className="flex flex-row items-center opacity-60 hover:opacity-100">
                <OptimizedSvgImage
                  src="/icons/leasepixie-icon-char.svg"
                  alt="Logo"
                  width={114}
                  height={36}
                  className="object-contain"
                  priority
                />
                <OptimizedSvgImage
                  src="/icons/ai-icon-char.svg"
                  alt="Logo"
                  width={32}
                  height={42}
                  className="object-contain mb-1"
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
