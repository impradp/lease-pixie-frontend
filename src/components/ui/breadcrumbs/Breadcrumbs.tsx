"use client";

import React from "react";
import Link from "next/link";
import { BreadcrumbItem } from "@/types/BreadcrumbItem";
import { ellipseCharacter } from "@/lib/utils/stringUtils";

/**
 * Props for the Breadcrumbs component
 */
interface BreadcrumbsProps {
  items: BreadcrumbItem[]; // Array of breadcrumb items to display
}

/**
 * Renders a breadcrumb navigation with responsive desktop and mobile layouts
 * @param props - The properties for configuring the breadcrumbs
 * @returns JSX.Element - The rendered breadcrumb component
 */
function Breadcrumbs({ items }: Readonly<BreadcrumbsProps>) {
  // Common rendering function for breadcrumb items
  const renderBreadcrumbItem = (item: BreadcrumbItem) => (
    <Link key={item.href} href={item.href}>
      <span
        className={`font-inter font-normal text-12 leading-16 hover:text-primary-regular ${
          item.isActive ? "text-primary-regular" : "text-primary-fade"
        }`}
      >
        -&gt; {ellipseCharacter(item.label, 45)}
      </span>
    </Link>
  );

  return (
    <div className="flex items-start justify-start text-xs mx-auto">
      {/* Desktop Layout: First item separate, rest in a row */}
      <div className="hidden xs:flex xs:flex-col mb-[1px]">
        {items.length > 0 && renderBreadcrumbItem(items[0])}
        {items.length > 1 && (
          <div className="flex flex-row space-x-1">
            {items.slice(1).map(renderBreadcrumbItem)}
          </div>
        )}
      </div>

      {/* Mobile Layout: Vertical stack */}
      <div className="flex xs:hidden flex-col justify-start">
        {items.map(renderBreadcrumbItem)}
      </div>
    </div>
  );
}

export default Breadcrumbs;
