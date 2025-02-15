import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google'
import Nav from "@/components/Nav";
import { Toaster } from "@/components/ui/toaster"



export const metadata: Metadata = {
  title: "Goal Gurus",
  description: "Goal Gurus is a platform for setting and achieving goals.",
};

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body
        className={`antialiased bg-dark-bg text-white`}
      >        
        <Nav />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
