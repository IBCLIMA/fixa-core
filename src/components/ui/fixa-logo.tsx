import { cn } from "@/lib/utils";

interface FixaLogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "text";
  theme?: "light" | "dark" | "brand";
}

const sizes = {
  xs: { icon: "h-6 w-6", text: "text-sm", gap: "gap-1.5" },
  sm: { icon: "h-7 w-7", text: "text-base", gap: "gap-2" },
  md: { icon: "h-9 w-9", text: "text-xl", gap: "gap-2.5" },
  lg: { icon: "h-12 w-12", text: "text-2xl", gap: "gap-3" },
  xl: { icon: "h-16 w-16", text: "text-4xl", gap: "gap-4" },
};

function FixaIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fixa-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      {/* Rounded square background */}
      <rect width="40" height="40" rx="10" fill="url(#fixa-grad)" />
      {/* F letter - bold, geometric */}
      <path
        d="M11 10h7.5v3h-4v3.5h3.5v3h-3.5v5h-3.5V10z"
        fill="white"
        fillOpacity="0.95"
      />
      {/* X as wrench - the key brand element */}
      {/* Left arm of X (top-left to bottom-right) */}
      <path
        d="M21 10l3.2 5.5L21 21l2 1.2 3.2-5.5 3.2 5.5 2-1.2-3.2-5.5L31.4 10h-3.6l-1.6 2.8L24.6 10H21z"
        fill="white"
        fillOpacity="0.95"
      />
      {/* Wrench hex head at bottom of X */}
      <path
        d="M23.2 24.5l-2.2 3.8v0c-.3.5-.1 1.1.4 1.4l1.7 1c.5.3 1.1.1 1.4-.4l2.2-3.8-1.8-1-1.7-1z"
        fill="white"
        fillOpacity="0.9"
      />
      <path
        d="M28.8 24.5l2.2 3.8c.3.5.1 1.1-.4 1.4l-1.7 1c-.5.3-1.1.1-1.4-.4l-2.2-3.8 1.8-1 1.7-1z"
        fill="white"
        fillOpacity="0.9"
      />
    </svg>
  );
}

export function FixaLogo({
  className,
  size = "md",
  variant = "full",
  theme = "light",
}: FixaLogoProps) {
  const s = sizes[size];

  const textColor = {
    light: "text-stone-900",
    dark: "text-white",
    brand: "text-orange-600",
  }[theme];

  if (variant === "icon") {
    return <FixaIcon className={cn(s.icon, className)} />;
  }

  if (variant === "text") {
    return (
      <span className={cn("font-extrabold tracking-tight", s.text, textColor, className)}>
        FIXA
      </span>
    );
  }

  return (
    <div className={cn("flex items-center", s.gap, className)}>
      <FixaIcon className={s.icon} />
      <span className={cn("font-extrabold tracking-tight", s.text, textColor)}>
        FIXA
      </span>
    </div>
  );
}
