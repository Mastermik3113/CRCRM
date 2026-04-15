"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TopBar } from "./topbar";
import { FAB } from "./fab";
import type { ReactNode } from "react";

const publicRoutes = ["/login", "/unauthorized"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

  useEffect(() => {
    if (isPublic) {
      setChecked(true);
      return;
    }
    // Check auth on every protected page
    const auth = localStorage.getItem("crcrm_auth");
    if (!auth) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [pathname, isPublic, router]);

  // Public routes — no shell
  if (isPublic) {
    return <>{children}</>;
  }

  // Welcome page — no sidebar but needs auth
  if (pathname === "/welcome") {
    if (!checked) return null;
    return <>{children}</>;
  }

  // Still checking auth
  if (!checked) return null;

  return (
    <div className="flex h-full flex-col">
      <TopBar />
      <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-background">
        {children}
      </main>
      <FAB />
    </div>
  );
}

export function logout() {
  localStorage.removeItem("crcrm_auth");
  localStorage.removeItem("crcrm_user");
  window.location.href = "/login";
}
