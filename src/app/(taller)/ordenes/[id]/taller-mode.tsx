"use client";

import { useState, useEffect, useCallback } from "react";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "fixa-taller-mode";

export function TallerModeToggle() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setActive(true);
    }
  }, []);

  const toggle = useCallback(() => {
    setActive((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return (
    <>
      <Button
        variant={active ? "default" : "outline"}
        size="sm"
        onClick={toggle}
        className="rounded-full gap-1.5"
        title="Modo taller: botones grandes para manos sucias"
      >
        <Wrench className="h-4 w-4" />
        <span className="hidden sm:inline">Modo taller</span>
      </Button>
      {active && <TallerModeClass />}
    </>
  );
}

/** Adds/removes the taller-mode class on the order container */
function TallerModeClass() {
  useEffect(() => {
    const container = document.getElementById("orden-detail-container");
    if (container) {
      container.classList.add("taller-mode");
    }
    return () => {
      if (container) {
        container.classList.remove("taller-mode");
      }
    };
  }, []);

  return null;
}
