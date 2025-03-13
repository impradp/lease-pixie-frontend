"use client";

import React, { useRef, useEffect } from "react";
import { X } from "lucide-react";
import PixieButton from "../ui/buttons/PixieButton";

interface SuggestWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
  onSuggest: (description: string) => void;
}

export default function SuggestWorkflow({
  isOpen,
  onClose,
  onSkip,
  onSuggest,
}: SuggestWorkflowProps) {
  const [description, setDescription] = React.useState("");
  const menuRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDescription(""); // Wipe data on outside click
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSuggestClick = () => {
    onSuggest(description);
    setDescription(""); // Wipe data on suggest
    onClose();
  };

  const handleSkipClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDescription(""); // Wipe data on skip
    onSkip();
  };

  if (!isOpen) return null;

  return (
    <form
      id="workflow_decribe"
      ref={menuRef}
      className="absolute z-10 top-[70px] right-5 w-[325px] bg-[#F2F2F2] rounded-xl p-4 border border-[#D0D5DD] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] max-w-[90.5%]"
    >
      <div className="flex justify-between items-center bg-[#F2F2F2] pb-0">
        <span>
          <strong className="text-[#0C111D] text-[16px] font-bold font-['Inter']">
            Add Workflow to...
          </strong>
        </span>
        <X
          className="w-5 h-5 cursor-pointer text-[#0C111D] hidden"
          onClick={onClose}
        />
      </div>
      <textarea
        name="decribe-wordflow"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        placeholder="2 line text box"
        className="w-full p-2.5 mt-2 bg-[#F9FAFB] border border-[#98A2B3] rounded-[10px] text-tertiary-light text-[14px] font-normal font-['Inter'] outline-none box-border"
      />
      <PixieButton
        label={"Suggest Workflow"}
        disabled={false}
        onClick={handleSuggestClick}
        className="w-full h-8 mt-2.5 flex items-center justify-center"
      />
      <button
        type="button"
        id="skip"
        onClick={handleSkipClick}
        className="w-full mt-2.5  text-[#000] rounded py-2.5 text-[12px] font-normal font-['Inter'] cursor-pointer"
      >
        Skip
      </button>
    </form>
  );
}
