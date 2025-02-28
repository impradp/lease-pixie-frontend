"use client";

import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { datePickerTheme } from "@/app/datePickerTheme";
import { PixieMonthPicker } from "@/components/ui/datePicker/PixieMonthPicker";

interface ClientThemeWrapperProps {
  readonly children: React.ReactNode;
}

export function ClientThemeWrapper({ children }: ClientThemeWrapperProps) {
  return <ThemeProvider theme={datePickerTheme}>{children}</ThemeProvider>;
}

export { PixieMonthPicker };
