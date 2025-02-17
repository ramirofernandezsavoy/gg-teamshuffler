import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Goal Gurus",
  description: "Goal Gurus is a platform for setting and achieving goals.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className={`antialiased bg-black text-white min-h-[100dvh] flex flex-col`}>

        <header className="">
          <Nav />
        </header>

        <main className="grow flex flex-col justify-center">
          {children}
        </main>

        <div>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
