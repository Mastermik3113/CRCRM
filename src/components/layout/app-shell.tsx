"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TopBar } from "./topbar";
import { FAB } from "./fab";
import { createClient } from "@/lib/supabase/client";
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

    const supabase = createClient();
    let active = true;

    // Initial session check
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (!data.session) {
        router.replace("/login");
      } else {
        setChecked(true);
      }
    });

    // Keep in sync with auth state changes (logout, token refresh, etc.)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (!session) {
        router.replace("/login");
      } else {
        setChecked(true);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
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

export async function logout() {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch {
    // ignore — we still want to redirect
  }
  window.location.href = "/login";
}
