"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface WorkflowItemCardProps {
  title: string;
  des: string;
  date: string;
  ago: number;
  city: string;
  containerColor: string;
  circleColor: string;
}

const WorkflowItemCard: React.FC<WorkflowItemCardProps> = ({
  title,
  des,
  date,
  ago,
  city,
  containerColor,
  circleColor,
}) => {
  const truncatedAgo =
    ago.toString().length > 6 ? ago.toString().slice(0, 6) + "..." : ago;

  return (
    <div className="flex mb-[16px] justify-between w-full box-border">
      <div
        className="max-w-[10px] w-[10px] rounded-tl-[10px] rounded-bl-[10px]"
        style={{ backgroundColor: containerColor }}
      ></div>
      <div className="bg-secondary-fill p-[13px] rounded-tr-[10px] rounded-br-[10px] flex-1 max-w-[calc(100%-10px)] box-border">
        <h4 className="font-semibold mb-[10px] whitespace-nowrap overflow-hidden text-ellipsis font-['Inter'] text-[13px] leading-[18px] text-tertiary-midnightBlue">
          {title}
        </h4>
        <p className="whitespace-nowrap overflow-hidden text-ellipsis text-tertiary-charcoalBlue font-['Inter'] text-[13px] font-normal leading-[18px]">
          {des}
        </p>
        <div className="flex items-center mt-[5px]">
          <p className="w-[88px] flex items-center whitespace-nowrap overflow-hidden text-ellipsis text-tertiary-charcoalBlue font-['Inter'] text-[13px] font-normal leading-[18px]">
            {date}
            <ArrowRight
              width={13}
              height={13}
              className="m-[2px]"
            ></ArrowRight>{" "}
            <span className="whitespace-nowrap overflow-hidden text-ellipsis inline-block max-w-[10ch]">
              {truncatedAgo}d
            </span>
          </p>
          <div
            className="w-[8px] h-[8px] rounded-full mx-[5px]"
            style={{ backgroundColor: circleColor }}
          />
          <p className="text-[#475467] font-['Inter'] text-[13px] font-normal leading-[18px] whitespace-nowrap overflow-hidden text-ellipsis">
            {city} (unit)
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkflowItemCard;
