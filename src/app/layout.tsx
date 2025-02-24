import { inter, myanmarKhyay } from "./fonts";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${myanmarKhyay.variable}`}>
      <body className="min-h-screen bg-custom-gradient">
        <Navbar />
        <main className="max-w-[1328px] mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
