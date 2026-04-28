import { cn } from "@/lib/utils";

interface GlowProps {
  variant?: "top" | "bottom" | "center";
  className?: string;
}

export default function Glow({ variant = "top", className }: GlowProps) {
  const positionClass = {
    top: "top-0",
    bottom: "bottom-0",
    center: "top-[50%] -translate-y-1/2",
  }[variant];

  return (
    <div className={cn("absolute w-full pointer-events-none", positionClass, className)}>
      <div
        className="absolute left-1/2 -translate-x-1/2 h-[256px] w-[60%] scale-[2.5] rounded-[50%] opacity-20 sm:h-[512px]"
        style={{
          background: "radial-gradient(ellipse at center, oklch(75.77% 0.159 55.91 / 0.5) 10%, transparent 60%)",
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 h-[128px] w-[40%] scale-[2] rounded-[50%] opacity-20 sm:h-[256px]"
        style={{
          background: "radial-gradient(ellipse at center, oklch(66.5% 0.1804 47.04 / 0.3) 10%, transparent 60%)",
        }}
      />
    </div>
  );
}
