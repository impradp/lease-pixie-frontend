import "./globals.css";
import { inter, myanmarKhyay } from "./fonts";
import PixieNavbar from "@/components/layout/PixieNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${myanmarKhyay.variable}`}>
      <body className="min-h-screen bg-custom-gradient">
        <PixieNavbar />

        <main className="max-w-[1180px] mx-auto px-auto pb-6">{children}</main>
      </body>
    </html>
  );
}
