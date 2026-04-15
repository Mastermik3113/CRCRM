import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Car Rental CRM brand logo — horizontal lockup.
 * Emblem on the left (emerald gradient circle + car silhouette),
 * wordmark on the right.
 */
export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const dims = {
    sm: { emblem: 28, emblemInner: 18, title: "text-sm", subtitle: "text-[9px]" },
    md: { emblem: 36, emblemInner: 22, title: "text-base", subtitle: "text-[10px]" },
    lg: { emblem: 56, emblemInner: 32, title: "text-2xl", subtitle: "text-xs" },
  }[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700 shadow-sm"
        style={{ width: dims.emblem, height: dims.emblem }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          width={dims.emblemInner}
          height={dims.emblemInner}
          className="text-white"
          aria-hidden="true"
        >
          <path
            d="M5 14l1.5-4A2 2 0 0 1 8.4 8.5h7.2a2 2 0 0 1 1.9 1.5L19 14v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4zm2.5 1.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
            fill="currentColor"
          />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-extrabold tracking-tight text-foreground", dims.title)}>
            Car Rental
          </span>
          <span
            className={cn(
              "font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400",
              dims.subtitle
            )}
          >
            CRM
          </span>
        </div>
      )}
    </div>
  );
}
