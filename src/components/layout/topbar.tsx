"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Bell, Search, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileSidebar } from "./mobile-sidebar";
import { logout } from "./app-shell";
import { useTheme } from "next-themes";
import { mainNav, secondaryNav, type NavItem } from "./nav-items";

function TopNavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-all duration-200 whitespace-nowrap",
        active
          ? "nav-active text-white"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

export function TopBar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-card/95 backdrop-blur border-b border-border sticky top-0 z-40 shadow-sm">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        {/* Mobile hamburger — left on mobile only */}
        <MobileSidebar />

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.svg"
            alt="Car Rental CRM"
            width={260}
            height={140}
            priority
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop horizontal nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {mainNav.map((item) => (
            <TopNavLink key={item.href} item={item} active={isActive(item.href)} />
          ))}
          <div className="mx-2 h-6 w-px bg-border" />
          {secondaryNav.map((item) => (
            <TopNavLink key={item.href} item={item} active={isActive(item.href)} />
          ))}
        </nav>

        {/* Search — desktop */}
        <div className="relative hidden xl:block ml-auto w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 h-9 bg-muted/60 border-transparent focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
          />
        </div>

        {/* Right cluster */}
        <div className={cn("flex items-center gap-1", "xl:ml-2 ml-auto")}>
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <Sun className="h-4.5 w-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4.5 w-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
              aria-label="Notifications"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                3
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="font-semibold">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="text-sm font-medium">Insurance expiring</span>
                <span className="text-xs text-muted-foreground">
                  2023 Toyota Camry - 5 days left
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="text-sm font-medium">Payment received</span>
                <span className="text-xs text-muted-foreground">
                  $1,200 via Zelle from John Smith
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="text-sm font-medium">Vehicle return due</span>
                <span className="text-xs text-muted-foreground">
                  Honda Civic - due tomorrow
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-sm text-primary font-medium justify-center">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="relative ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full outline-none transition-colors hover:bg-accent aria-expanded:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50"
              aria-label="Account menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs font-bold">
                  AD
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={logout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
