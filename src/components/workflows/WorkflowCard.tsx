import React from "react";

import { Workflow } from "@/types/workflow";
import WorkflowHeader from "@/components/workflows/WorkflowHeader";
import WorkflowItemCard from "@/components/workflows/WorkflowItemCard";

interface WorkflowCardProps {
  workflows?: Workflow[];
  isEditable?: boolean;
  onSearchChange?: (value: string) => void;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({
  workflows = [],
  isEditable = false,
  onSearchChange,
}) => {
  return (
    <div className="w-[408px] h-[1262px] max-xs:h-[932px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
      <div className="w-full">
        <WorkflowHeader
          isEditable={isEditable}
          onSearchChange={onSearchChange}
        />
      </div>
      <div className="w-full flex-1 overflow-y-auto">
        {workflows.length > 0 ? (
          workflows.map((workflow, index) => (
            <WorkflowItemCard
              key={index}
              title={workflow.title}
              des={workflow.workflowTitle}
              date={workflow.date}
              ago={workflow.estimatedDay ?? 0}
              city={workflow.unit}
              containerColor={workflow.statusColor ?? "#2790ac"}
              circleColor={
                workflow.isRead ? "#BBBBBB" : workflow.statusColor ?? "#2790ac"
              }
            />
          ))
        ) : (
          <div className="w-full py-8 flex items-center justify-center">
            <p className="text-[#424242] text-[16px] font-medium font-['Inter']">
              No workflows to display.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowCard;
