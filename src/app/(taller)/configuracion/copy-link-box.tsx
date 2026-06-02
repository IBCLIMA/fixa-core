"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyLinkBox({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-3">
      <code className="text-xs font-mono text-foreground flex-1 truncate">
        {url}
      </code>
      <Button
        variant="outline"
        size="sm"
        className="rounded-full text-xs shrink-0"
        onClick={handleCopy}
      >
        {copied ? (
          <>
            <Check className="mr-1 h-3 w-3" />
            Copiado
          </>
        ) : (
          <>
            <Copy className="mr-1 h-3 w-3" />
            Copiar
          </>
        )}
      </Button>
    </div>
  );
}
