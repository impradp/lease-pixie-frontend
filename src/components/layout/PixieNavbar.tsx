"use client";

import React, { useState } from "react";
import Image from "next/image";
import SidebarMenu from "@/components/menus/SidebarMenu";

const PixieNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full pt-4">
      <div className="max-w-[1180px] mx-auto px-1 flex flex-col">
        {/* Top section with logo and icon */}
        <div className="flex justify-end items-center">
          <div className="mr-2">
            <Image
              src="/icons/leasepixie-icon.svg"
              alt="Primary Icon"
              width={22}
              height={22}
              className="object-contain cursor-pointer"
              onClick={() => setIsMenuOpen(true)}
            />
          </div>
          <div>
            <Image
              src="/icons/leasepixie-icon-char.svg"
              alt="Logo"
              width={107}
              height={22}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
};

export default PixieNavbar;
