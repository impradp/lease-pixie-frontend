"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SidebarMenu from "@/components/menus/SidebarMenu";

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoClick = () => {
    router.push("/account/dashboard");
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="w-full max-w-[1328px] mx-auto px-4">
      <div className="h-[92px] flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleLogoClick}
        >
          <Image
            src="/icons/lease-pixie-logo.svg"
            alt="Lease Pixie Logo"
            width={16}
            height={18}
            priority
          />
          <span className="font-myanmar-khyay text-lg text-primary-button">
            Lease Pixie
          </span>
        </div>

        <button className="p-2 rounded-lg" onClick={handleMenuToggle}>
          <Image
            src="/icons/hamburger.svg"
            alt="Menu"
            width={24}
            height={24}
            priority // Ensure consistent SSR behavior
          />
        </button>
      </div>
      <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </nav>
  );
};

export default Navbar;
