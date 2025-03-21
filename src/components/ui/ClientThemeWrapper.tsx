"use client";

import React from "react";
import dynamic from "next/dynamic";

import { ThemeProvider } from "@mui/material/styles";
import { datePickerTheme } from "@/app/datePickerTheme";

const PixieMonthPicker = dynamic(
  () => import("@/components/ui/datePicker/PixieMonthPicker"),
  {
    ssr: false,
    loading: () => <p>Loading month picker...</p>,
  }
);

interface ClientThemeWrapperProps {
  readonly children: React.ReactNode;
}

export function ClientThemeWrapper({ children }: ClientThemeWrapperProps) {
  return <ThemeProvider theme={datePickerTheme}>{children}</ThemeProvider>;
}

export { PixieMonthPicker };
