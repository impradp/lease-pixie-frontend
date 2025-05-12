"use client";

import React, { useState, useEffect } from "react";

import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MUIDatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

interface PixieDatePickerProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  isEditing: boolean;
  dateFormat?: readonly ("year" | "month" | "day")[];
}

export const PixieDatePicker: React.FC<PixieDatePickerProps> = ({
  label = "",
  value = "",
  onChange,
  readOnly = false,
  isEditing,
  dateFormat = ["year", "month", "day"],
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    value || null
  );
  const [open, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"year" | "month" | "day">(
    dateFormat[0] || "day"
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDateChange = (newValue: dayjs.Dayjs | null) => {
    if (!readOnly && isEditing) {
      const isoDate = newValue ? newValue.toISOString() : "";
      setSelectedDate(isoDate);
      onChange?.(isoDate);

      // Close the popup if the current view is the last in dateFormat
      if (currentView === dateFormat[dateFormat.length - 1]) {
        setOpen(false);
      }
    }
  };

  const handleViewChange = (view: "year" | "month" | "day") => {
    if (dateFormat.includes(view)) {
      setCurrentView(view);
    }
  };

  const handleCalendarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEditing && !readOnly) {
      setOpen(true);
    }
  };

  // Reset view to the first in dateFormat when closing
  useEffect(() => {
    if (!open) {
      setCurrentView(dateFormat[0] || "day");
    }
  }, [open, dateFormat]);

  if (!isMounted) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="w-full flex flex-col gap-1.5">
        {/* Label Container */}
        <div className="text-tertiary-slateBlue text-sm font-medium font-['Inter'] leading-[18px]">
          {label}
        </div>
        {/* Input Container */}
        <div className="w-full relative">
          <MUIDatePicker
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            value={selectedDate ? dayjs(selectedDate) : null}
            onChange={handleDateChange}
            readOnly={readOnly || !isEditing}
            openTo={dateFormat[0] || "day"}
            views={dateFormat}
            view={currentView}
            onViewChange={handleViewChange}
            className={`w-full h-[44px] px-3.5 py-2.5 bg-white rounded-lg border border-tertiary-stroke justify-between items-center gap-2 flex ${
              isEditing && !readOnly ? "cursor-pointer" : "cursor-default"
            }`}
            slotProps={{
              textField: {
                variant: "standard",
                sx: {
                  "& .MuiPickersInputBase-root": {
                    width: "100%",
                    height: "44px",
                    padding: "0 14px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #cfd4dc",
                    cursor: `${isEditing ? "pointer" : "default"}`,
                  },
                },
                InputProps: {
                  disableUnderline: true,
                  endAdornment: (
                    <Calendar
                      className={`w-5 h-5 stroke-secondary-icon absolute right-2 top-1/2 transform -translate-y-1/2 ${
                        isEditing && !readOnly
                          ? "cursor-pointer"
                          : "cursor-default"
                      }`}
                      onClick={handleCalendarClick}
                    />
                  ),
                },
                onClick: () => {
                  if (isEditing && !readOnly) setOpen(true);
                },
              },
              popper: {
                className: "z-[1000] overflow-visible",
              },
              actionBar: {
                actions: [],
              },
            }}
            disabled={!isEditing || readOnly}
          />
        </div>
      </div>
    </LocalizationProvider>
  );
};
