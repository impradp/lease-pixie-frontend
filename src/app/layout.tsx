import "./globals.css";
import { inter, myanmarKhyay } from "./fonts";
import Footer from "@/components/ui/footer/Footer";
import PixieNavbar from "@/components/ui/navbar/PixieNavbar";

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
        <PixieNavbar className="max-w-[1360px] mx-auto px-5.5 sm:px-6 md:px-[45px] lg:px-[45px] " />
        <main className="w-full max-w-[1360px] mx-auto px-5.5 sm:px-6 md:px-[45px] lg:px-[45px] pb-6 flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
