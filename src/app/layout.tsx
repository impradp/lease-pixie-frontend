import "./globals.css";
import { inter, myanmarKhyay } from "./fonts";
import PixieNavbar from "@/components/layout/PixieNavbar";
import Footer from "@/components/ui/Footer";

export const metadata = {
  title: "Lease Pixie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${myanmarKhyay.variable}`}>
      <body className="min-h-screen bg-custom-gradient flex flex-col">
        <PixieNavbar />
        <main className="flex-grow max-w-[1180px] mx-auto px-auto pb-6 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
