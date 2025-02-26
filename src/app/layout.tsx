import "./globals.css";
import { inter, myanmarKhyay } from "./fonts";
import Navbar from "@/components/layout/Navbar";
import PixieNavbar from "@/components/layout/PixieNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${myanmarKhyay.variable}`}>
      <body className="min-h-screen bg-custom-gradient">
        {/* Show PixieNavbar on larger screens (≥431px) */}
        <div className="hidden sm:block">
          <PixieNavbar />
        </div>

        {/* Show MobileNavbar on small screens (≤430px) */}
        <div className="block sm:hidden">
          <Navbar />
        </div>

        <main className="max-w-[1180px] mx-auto px-1 pb-6">{children}</main>
      </body>
    </html>
  );
}
