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

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const mainNav: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Vehicles", href: "/vehicles", icon: Car },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Bookings", href: "/bookings", icon: CalendarCheck },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Calendar", href: "/calendar", icon: Calendar },
];

export const secondaryNav: NavItem[] = [
  { label: "Back Office", href: "/back-office", icon: Building2 },
  { label: "Settings", href: "/settings", icon: Settings },
];
