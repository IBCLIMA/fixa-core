"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function BackgroundGradientAnimation({
  gradientBackgroundStart = "rgb(250, 249, 247)",
  gradientBackgroundEnd = "rgb(245, 243, 240)",
  firstColor = "249, 115, 22",
  secondColor = "59, 130, 246",
  thirdColor = "168, 85, 247",
  fourthColor = "245, 158, 11",
  fifthColor = "16, 185, 129",
  pointerColor = "249, 115, 22",
  size = "80%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  useEffect(() => {
    document.body.style.setProperty("--gradient-background-start", gradientBackgroundStart);
    document.body.style.setProperty("--gradient-background-end", gradientBackgroundEnd);
    document.body.style.setProperty("--first-color", firstColor);
    document.body.style.setProperty("--second-color", secondColor);
    document.body.style.setProperty("--third-color", thirdColor);
    document.body.style.setProperty("--fourth-color", fourthColor);
    document.body.style.setProperty("--fifth-color", fifthColor);
    document.body.style.setProperty("--pointer-color", pointerColor);
    document.body.style.setProperty("--size", size);
    document.body.style.setProperty("--blending-value", blendingValue);
  }, []);

  useEffect(() => {
    if (!interactive) return;
    let animationFrame: number;

    function move() {
      setCurX((prev) => prev + (tgX - prev) / 20);
      setCurY((prev) => prev + (tgY - prev) / 20);
      if (interactiveRef.current) {
        interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      }
      animationFrame = requestAnimationFrame(move);
    }

    animationFrame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(animationFrame);
  }, [tgX, tgY, curX, curY, interactive]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    setTgX(event.clientX);
    setTgY(event.clientY);
  };

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden top-0 left-0",
        containerClassName
      )}
      onMouseMove={handleMouseMove}
    >
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className={cn("", className)}>{children}</div>

      <div
        className="gradients-container absolute inset-0 opacity-30"
        style={{ filter: "url(#blurMe) blur(40px)" }}
      >
        {/* Animated gradient blobs */}
        <div
          className="absolute animate-first opacity-100"
          style={{
            background: `radial-gradient(circle at center, rgba(var(--first-color), 0.8) 0, rgba(var(--first-color), 0) 50%) no-repeat`,
            width: "var(--size)",
            height: "var(--size)",
            top: "calc(50% - var(--size) / 2)",
            left: "calc(50% - var(--size) / 2)",
            mixBlendMode: blendingValue as any,
          }}
        />
        <div
          className="absolute animate-second opacity-100"
          style={{
            background: `radial-gradient(circle at center, rgba(var(--second-color), 0.8) 0, rgba(var(--second-color), 0) 50%) no-repeat`,
            width: "var(--size)",
            height: "var(--size)",
            top: "calc(50% - var(--size) / 2)",
            left: "calc(50% - var(--size) / 2)",
            mixBlendMode: blendingValue as any,
          }}
        />
        <div
          className="absolute animate-third opacity-100"
          style={{
            background: `radial-gradient(circle at center, rgba(var(--third-color), 0.8) 0, rgba(var(--third-color), 0) 50%) no-repeat`,
            width: "var(--size)",
            height: "var(--size)",
            top: "calc(50% - var(--size) / 2 + 200px)",
            left: "calc(50% - var(--size) / 2 - 500px)",
            mixBlendMode: blendingValue as any,
          }}
        />
        <div
          className="absolute animate-fourth opacity-70"
          style={{
            background: `radial-gradient(circle at center, rgba(var(--fourth-color), 0.8) 0, rgba(var(--fourth-color), 0) 50%) no-repeat`,
            width: "var(--size)",
            height: "var(--size)",
            top: "calc(50% - var(--size) / 2)",
            left: "calc(50% - var(--size) / 2)",
            mixBlendMode: blendingValue as any,
          }}
        />
        <div
          className="absolute animate-fifth opacity-100"
          style={{
            background: `radial-gradient(circle at center, rgba(var(--fifth-color), 0.8) 0, rgba(var(--fifth-color), 0) 50%) no-repeat`,
            width: "var(--size)",
            height: "var(--size)",
            top: "calc(50% - var(--size) / 2)",
            left: "calc(50% - var(--size) / 2)",
            mixBlendMode: blendingValue as any,
          }}
        />

        {interactive && (
          <div
            ref={interactiveRef}
            className="absolute opacity-70"
            style={{
              background: `radial-gradient(circle at center, rgba(var(--pointer-color), 0.8) 0, rgba(var(--pointer-color), 0) 50%) no-repeat`,
              width: "100%",
              height: "100%",
              top: "-50%",
              left: "-50%",
              mixBlendMode: blendingValue as any,
            }}
          />
        )}
      </div>
    </div>
  );
}
