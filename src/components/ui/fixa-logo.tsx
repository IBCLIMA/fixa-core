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
  // "La Tuerca mecanizada": hexágono redondeado con faceta de brillo + F
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
      {/* Hexágono (tuerca) con esquinas redondeadas */}
      <path
        d="M20 4l13 7.5v17L20 36 7 28.5v-17L20 4z"
        fill="url(#fixa-grad)"
        stroke="url(#fixa-grad)"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* Faceta de brillo (metal mecanizado) */}
      <path d="M20 1.6l15.5 9-15.5 9-15.5-9 15.5-9z" fill="white" fillOpacity="0.12" />
      {/* F */}
      <path d="M14.5 11h11.5v4h-7v4h6v4h-6v6h-4.5V11z" fill="white" />
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
