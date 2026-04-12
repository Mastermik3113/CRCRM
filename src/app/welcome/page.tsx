"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Car, Users, CalendarCheck, LayoutDashboard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const quickActions = [
  { label: "Go to Dashboard", description: "View your fleet overview and key metrics", href: "/", icon: LayoutDashboard, color: "from-emerald-500 to-emerald-600" },
  { label: "New Booking", description: "Create a new rental reservation", href: "/bookings", icon: CalendarCheck, color: "from-blue-500 to-blue-600" },
  { label: "Manage Vehicles", description: "View and update your fleet inventory", href: "/vehicles", icon: Car, color: "from-amber-500 to-amber-600" },
  { label: "View Clients", description: "Manage your client database and leads", href: "/clients", icon: Users, color: "from-purple-500 to-purple-600" },
];

export default function WelcomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    const auth = localStorage.getItem("crcrm_auth");
    if (!auth) {
      router.push("/login");
      return;
    }
    const name = localStorage.getItem("crcrm_user") ?? "Admin";
    setUserName(name);
  }, [router]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-8 animate-slide-in-up">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-extrabold text-xl mb-4">
            CR
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {greeting}, {userName}! 👋
          </h1>
          <p className="text-muted-foreground">
            What would you like to do today?
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Card className="card-hover cursor-pointer h-full">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{action.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
