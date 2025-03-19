import React from "react";
import { PillItem } from "@/types/Pills";

interface PillsProps {
  items: PillItem[];
  className?: string;
}

export const Pills: React.FC<PillsProps> = ({ items, className = "" }) => {
  return (
    <div
      className={`inline-flex justify-start items-center gap-3 ${className}`}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="px-2 py-0.5 mix-blend-multiply rounded-2xl outline outline-1 outline-offset-[-1px] flex justify-start items-center"
          style={{
            backgroundColor: `${item.color}1A`, // 10% opacity
            outlineColor: item.borderColor,
          }}
        >
          <div
            className="text-center justify-start text-xs font-medium font-['Inter'] leading-[18px]"
            style={{ color: item.textColor }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};
