"use client";

import { useState } from "react";
import { Plus, Car, Users, CalendarCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const actions = [
  { label: "New Booking", href: "/bookings?new=true", icon: CalendarCheck, color: "bg-blue-500" },
  { label: "Add Client", href: "/clients?new=true", icon: Users, color: "bg-purple-500" },
  { label: "Add Vehicle", href: "/vehicles?new=true", icon: Car, color: "bg-amber-500" },
];

export function FAB() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* Main FAB button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 fab-expand",
          open
            ? "bg-gray-700 rotate-45 scale-90"
            : "bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:scale-110 hover:shadow-xl"
        )}
      >
        {open ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Plus className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Action items */}
      {open && (
        <div className="flex flex-col gap-2 animate-slide-in-up">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 group"
              >
                <span className="rounded-lg bg-card px-3 py-1.5 text-sm font-medium shadow-md border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {action.label}
                </span>
                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full shadow-md text-white transition-transform hover:scale-110",
                    action.color
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
