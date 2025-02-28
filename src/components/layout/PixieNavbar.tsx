"use client";

import React, { useState } from "react";
import Image from "next/image";

import SidebarMenu from "@/components/menus/SidebarMenu";

const PixieNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full pt-12">
      <div className="max-w-[1180px] mx-auto px-1 flex flex-col">
        <div className="flex justify-end items-center">
          <div className="relative w-fit">
            <div
              onClick={handleMenuToggle}
              className={`flex flex-row cursor-pointer ${
                isMenuOpen ? "opacity-60" : ""
              }`}
            >
              <Image
                src="/icons/leasepixie-icon.svg"
                alt="Primary Icon"
                width={22}
                height={22}
                className="mr-2 object-contain pb-2"
              />
              <Image
                src="/icons/leasepixie-icon-char.svg"
                alt="Logo"
                width={107}
                height={22}
                className="object-contain"
              />
              <Image
                src="/icons/ai-icon-char.svg"
                alt="Logo"
                width={30}
                height={18}
                className="object-contain pb-1"
              />
            </div>
            {/* SidebarMenu placed directly beneath */}
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
