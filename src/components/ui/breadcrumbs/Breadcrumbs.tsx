"use client";

import Link from "next/link";
import { ellipseCharacter } from "@/utils/textUtils";
import { BreadcrumbItem } from "@/types/BreadcrumbItem";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: Readonly<BreadcrumbsProps>) {
  return (
    <div className="flex items-start justify-start text-xs mb-auto mx-auto">
      {/* Desktop Layout */}
      <div className="hidden xs:flex xs:flex-col mb-[1px]">
        {items.map((item, index) => {
          if (index === 0) {
            return (
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
          }
          return null; // We'll handle the rest below
        })}
        {items.length > 1 && (
          <div className="flex flex-row space-x-1">
            {items.slice(1).map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={`font-inter font-normal text-12 leading-16 hover:text-primary-regular ${
                    item.isActive ? "text-primary-regular" : "text-primary-fade"
                  }`}
                >
                  -&gt; {ellipseCharacter(item.label, 45)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="flex xs:hidden flex-col justify-start">
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            <span
              className={`font-inter font-normal text-12 leading-16 hover:text-primary-regular ${
                item.isActive ? "text-primary-regular" : "text-primary-fade"
              }`}
            >
              -&gt; {ellipseCharacter(item.label, 45)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
