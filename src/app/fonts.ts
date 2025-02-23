import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const myanmarKhyay = localFont({
  src: "../fonts/MyanmarKhyay.woff2",
  variable: "--font-myanmar-khyay",
});
