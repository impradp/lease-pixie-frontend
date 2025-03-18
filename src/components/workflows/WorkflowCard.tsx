"use client";

import React, { useState } from "react";
import { Workflow } from "@/types/workflow";
import WorkflowHeader from "@/components/workflows/WorkflowHeader";
import WorkflowItemCard from "@/components/workflows/WorkflowItemCard";
import SuggestWorkflow from "@/components/workflows/SuggestWorkflow";
import { AddWorkflow } from "@/components/workflows/AddWorkflow"; // Import the new component

interface WorkflowCardProps {
  workflows?: Workflow[];
  isEditable?: boolean;
  onSearchChange?: (value: string) => void;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({
  workflows = [],
  isEditable = true,
  onSearchChange,
}) => {
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [isAddWorkflowOpen, setIsAddWorkflowOpen] = useState(false); // New state for AddWorkflow
  const [isPlusClicked, setIsPlusClicked] = useState(false);

  const handleAddClick = () => {
    setIsPlusClicked(true);
    setIsSuggestOpen(true);
  };

  const handleSuggestClose = () => {
    setIsSuggestOpen(false);
    setIsPlusClicked(false);
  };

  const handleSkip = () => {
    setIsSuggestOpen(false);
    setIsPlusClicked(false);
  };

  const handleSuggest = () => {
    setIsSuggestOpen(false); // Close the SuggestWorkflow popup
    setIsAddWorkflowOpen(true); // Open the AddWorkflow component
    setIsPlusClicked(false); // Reset plus button state
  };

  const handleAddWorkflowClose = () => {
    setIsAddWorkflowOpen(false);
  };

  const handleAddWorkflowSubmit = () => {
    setIsAddWorkflowOpen(false); // Close AddWorkflow after submission
  };

  const handleSortIconClick = () => {
    //TODO: Handle Sort icon click
  };

  const handleRefreshClick = () => {
    //TODO: Handle refresh click
  };

  return (
    <div className="relative w-[408px] h-[1262px] max-xs:h-[932px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
      {/* Workflow Header */}
      <div className="w-full">
        <WorkflowHeader
          isEditable={isEditable}
          onSearchChange={onSearchChange}
          onAddClick={handleAddClick}
          onSortIconClick={handleSortIconClick}
          onRefreshClick={handleRefreshClick}
          isPlusClicked={isPlusClicked}
        />
      </div>

      {/* AddWorkflow Component (Displays only when suggest is clicked) */}
      {isAddWorkflowOpen && (
        <div className="w-full">
          <AddWorkflow
            onClose={handleAddWorkflowClose}
            onAdd={handleAddWorkflowSubmit}
          />
        </div>
      )}

      {/* Workflow List */}
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
            <p className="text-tertiary-charcoalGrey text-[16px] font-medium font-['Inter']">
              No workflows to display.
            </p>
          </div>
        )}
      </div>

      {/* SuggestWorkflow Popup */}
      <SuggestWorkflow
        isOpen={isSuggestOpen}
        onClose={handleSuggestClose}
        onSkip={handleSkip}
        onSuggest={handleSuggest}
      />
    </div>
  );
};

export default WorkflowCard;
