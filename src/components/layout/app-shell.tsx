"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { FAB } from "./fab";
import type { ReactNode } from "react";

const publicRoutes = ["/login", "/welcome", "/unauthorized"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

  if (isPublic) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-background">
          {children}
        </main>
      </div>
      <FAB />
    </div>
  );
}
