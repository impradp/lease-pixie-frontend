"use client";

import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MUIDatePicker } from "@mui/x-date-pickers/DatePicker";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";

interface PixieDatePickerProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  isEditing: boolean;
}

export const PixieDatePicker: React.FC<PixieDatePickerProps> = ({
  label = "",
  value = "",
  onChange,
  readOnly = false,
  isEditing,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    value ? value : null
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDateChange = (newValue: dayjs.Dayjs | null) => {
    if (!readOnly && isEditing) {
      const isoDate = newValue ? newValue.toISOString() : "";
      setSelectedDate(isoDate);
      onChange?.(isoDate);
      // Do not close the popup here; let onAccept handle it
    }
  };

  const handleDateAccept = (newValue: dayjs.Dayjs | null) => {
    // Called when a date is fully confirmed (month and day selected)
    if (newValue && !readOnly && isEditing) {
      setOpen(false); // Close the popup after a complete date is selected
    }
  };

  const handleCalendarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEditing && !readOnly) {
      setOpen(true);
    }
  };

  if (!isMounted) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="w-full xs:w-[460px] h-[42px] justify-end items-center gap-2 inline-flex relative bg-white overflow-visible">
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
            onAccept={handleDateAccept} // Handle closing after full date selection
            readOnly={readOnly || !isEditing}
            openTo="day"
            views={["month", "day"]}
            className={`w-full grow shrink basis-0 h-9 px-3.5 py-2.5 bg-white rounded-lg border border-tertiary-stroke justify-between items-center gap-2 flex overflow-visible ${
              isEditing && !readOnly ? "cursor-pointer" : "cursor-default"
            }`}
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
                  // Set MuiInput-underline to transparent
                  "& .MuiInput-underline": {
                    "&:before": {
                      borderBottomColor: "transparent", // Default underline
                    },
                    "&:hover:not(.Mui-disabled):before": {
                      borderBottomColor: "transparent", // Underline on hover
                    },
                    "&:after": {
                      borderBottomColor: "rgba(71, 84, 102, 1)", // Underline when focused
                    },
                  },
                  // Set MuiInputBase-colorPrimary states to transparent where applicable
                  "& .MuiInputBase-colorPrimary": {
                    "&.Mui-focused": {
                      "& .MuiInput-underline:after": {
                        borderBottomColor: "transparent", // Ensure focused underline is transparent
                      },
                    },
                  },
                },
                InputProps: {
                  endAdornment: (
                    <Calendar
                      className="w-5 h-5 stroke-secondary-icon cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2"
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
