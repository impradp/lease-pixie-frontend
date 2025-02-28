"use client";

import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DatePicker as MUIDatePicker,
  PickersCalendarHeaderProps,
} from "@mui/x-date-pickers";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import dayjs, { Dayjs } from "dayjs";

interface PixieMonthPickerProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  isEditing: boolean;
}

// Custom calendar header component that only shows month name without year
// but keeps the month selection capability
const CustomCalendarHeader = (props: PickersCalendarHeaderProps<Dayjs>) => {
  const { currentMonth, onMonthChange, views, onViewChange } = props;

  const handlePrevMonth = () => {
    onMonthChange(currentMonth.subtract(1, "month"), "left");
  };

  const handleNextMonth = () => {
    onMonthChange(currentMonth.add(1, "month"), "right");
  };

  // Format to show only the month name
  const formattedMonth = currentMonth.format("MMMM");

  // Toggle to month selection view when month is clicked
  const handleMonthClick = () => {
    if (views.includes("month") && onViewChange) {
      onViewChange("month");
    }
  };

  return (
    <div className="flex justify-between items-center p-2 mb-2">
      <button
        aria-label="Previous month"
        onClick={handlePrevMonth}
        className="p-1 rounded-full hover:bg-gray-100"
        type="button"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={handleMonthClick}
        className="text-tertiary-light font-medium hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
        type="button"
      >
        {formattedMonth}
      </button>
      <button
        aria-label="Next month"
        onClick={handleNextMonth}
        className="p-1 rounded-full hover:bg-gray-100"
        type="button"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export const PixieMonthPicker: React.FC<PixieMonthPickerProps> = ({
  label = "",
  value = "",
  onChange,
  readOnly = false,
  isEditing,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    value || null
  );
  const [open, setOpen] = useState(false);
  // Track the current view state to handle mobile view transitions
  const [currentView, setCurrentView] = useState<"day" | "month">("day");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDateChange = (newValue: dayjs.Dayjs | null) => {
    if (!readOnly && isEditing) {
      const isoDate = newValue ? newValue.toISOString() : "";
      setSelectedDate(isoDate);
      if (onChange) {
        onChange(isoDate);
      }

      // Only close the picker if we're on day view
      // This prevents closing when just selecting a month
      if (currentView === "day") {
        setOpen(false);
      }
    }
  };

  const handleViewChange = (view: "day" | "month" | "year") => {
    if (view === "day" || view === "month") {
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

  const handleCalendarKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isEditing && !readOnly) {
        setOpen(true);
      }
    }
  };

  // Reset view to day when closing the picker
  useEffect(() => {
    if (!open) {
      setCurrentView("day");
    }
  }, [open]);

  if (!isMounted) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="w-full xs:w-[460px] h-[42px] justify-end items-center gap-2 inline-flex relative overflow-visible">
        <div className="text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
          {label}
        </div>
        <div className="w-full xs:w-[153px] self-stretch justify-start items-center gap-2 flex relative">
          <MUIDatePicker
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            value={selectedDate ? dayjs(selectedDate) : null}
            onChange={handleDateChange}
            readOnly={readOnly || !isEditing}
            openTo="day"
            views={["month", "day"]}
            onViewChange={handleViewChange}
            view={currentView}
            className={`w-full grow shrink basis-0 h-9 px-3.5 py-2.5 bg-white rounded-lg border border-tertiary-stroke justify-between items-center gap-2 flex overflow-visible ${
              isEditing && !readOnly ? "cursor-pointer" : "cursor-default"
            }`}
            slots={{
              calendarHeader: CustomCalendarHeader,
            }}
            slotProps={{
              textField: {
                variant: "standard",
                sx: {
                  "& .MuiInputBase-root": {
                    width: "100%",
                    height: "36px",
                    padding: "0 14px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #cfd4dc",
                    "&:hover": {
                      borderColor: "#cfd4dc",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    display: "none",
                  },
                  "& .MuiInputBase-input": {
                    paddingRight: "32px",
                    color: "#475467",
                    fontSize: 14,
                    fontFamily: "Inter",
                  },
                  "& .MuiInput-underline": {
                    "&:before": {
                      borderBottomColor: "transparent",
                    },
                    "&:hover:not(.Mui-disabled):before": {
                      borderBottomColor: "transparent",
                    },
                    "&:after": {
                      borderBottomColor: "rgba(71, 84, 102, 1)",
                    },
                  },
                  "& .MuiInputBase-colorPrimary": {
                    "&.Mui-focused": {
                      "& .MuiInput-underline:after": {
                        borderBottomColor: "transparent",
                      },
                    },
                  },
                },
                InputProps: {
                  endAdornment: (
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label="Open calendar"
                      onClick={handleCalendarClick}
                      onKeyDown={handleCalendarKeyDown}
                    >
                      <Calendar className="w-5 h-5 stroke-secondary-icon cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2" />
                    </div>
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
