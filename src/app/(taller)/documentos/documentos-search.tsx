"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function DocumentosSearch({ initialSearch }: { initialSearch: string }) {
  const [search, setSearch] = useState(initialSearch);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    router.push(`/documentos${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar por cliente o matrícula..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-9 rounded-xl"
      />
    </form>
  );
}
