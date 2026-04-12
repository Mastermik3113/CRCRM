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
  type LucideIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

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

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {item.label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col border-r bg-card">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Car className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold">RentFlow</span>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {mainNav.map((item) => (
            <NavLink key={item.href} item={item} isActive={isActive(item.href)} />
          ))}
        </nav>
        <Separator className="my-4" />
        <nav className="flex flex-col gap-1">
          {secondaryNav.map((item) => (
            <NavLink key={item.href} item={item} isActive={isActive(item.href)} />
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}

export { mainNav, secondaryNav };
