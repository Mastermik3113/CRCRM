"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Car,
  Users,
  CalendarCheck,
  CreditCard,
  Calendar,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { demoVehicles } from "@/lib/demo-data";
import { logout } from "./app-shell";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const mainNav: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Vehicles", href: "/vehicles", icon: Car },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Bookings", href: "/bookings", icon: CalendarCheck },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Calendar", href: "/calendar", icon: Calendar },
];

const secondaryNav: NavItem[] = [
  { label: "Back Office", href: "/back-office", icon: Building2 },
  { label: "Settings", href: "/settings", icon: Settings },
];

function NavLink({
  item,
  isActive,
  collapsed,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  const linkContent = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-all duration-200",
        isActive
          ? "nav-active text-white"
          : "text-slate-400 hover:text-white hover:bg-white/[0.08]",
        collapsed && "justify-center px-2"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={<span />}>
          {linkContent}
        </TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "hidden lg:flex lg:flex-col sidebar-gradient transition-all duration-300 relative",
        collapsed ? "lg:w-[70px]" : "lg:w-[250px]"
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          "flex h-16 items-center gap-3 border-b border-white/[0.08] px-5",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-extrabold text-sm">
          CR
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-white tracking-tight">
            CRCRM
          </span>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-card border border-border shadow-md text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {mainNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
              collapsed={collapsed}
            />
          ))}
        </nav>
        <Separator className="my-4 bg-white/[0.08]" />
        <nav className="flex flex-col gap-1">
          {secondaryNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* Fleet Status */}
      {!collapsed && (
        <div className="border-t border-white/[0.08] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Fleet Status
          </p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Available</span>
              <span className="text-xs font-semibold text-emerald-400">{demoVehicles.filter(v => v.status === "available").length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Rented</span>
              <span className="text-xs font-semibold text-blue-400">{demoVehicles.filter(v => v.status === "rented").length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Maintenance</span>
              <span className="text-xs font-semibold text-amber-400">{demoVehicles.filter(v => v.status === "maintenance").length}</span>
            </div>
          </div>
        </div>
      )}

      {/* User Profile */}
      <div
        className={cn(
          "border-t border-white/[0.08] px-4 py-3 flex items-center gap-3",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs font-bold">
          AD
        </div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">Admin</p>
              <p className="text-[11px] text-slate-400">Administrator</p>
            </div>
            <button
              onClick={logout}
              className="text-slate-500 hover:text-red-400 transition-colors"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}

export { mainNav, secondaryNav };
