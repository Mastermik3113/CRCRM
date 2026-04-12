import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { FAB } from "@/components/layout/fab";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRCRM - Car Rental Management",
  description: "Car Rental CRM and Back-Office Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="h-full font-sans antialiased">
        <ThemeProvider>
          <TooltipProvider>
            <div className="flex h-full">
              <Sidebar />
              <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-background">
                  {children}
                </main>
              </div>
            </div>
            <FAB />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
