"use client";

import { useState, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

/**
 * Sustituto de window.confirm con diseño propio.
 * Uso:
 *   const { confirm, ConfirmUI } = useConfirm();
 *   ...
 *   if (await confirm({ title: "¿Entregar el coche?" })) { ... }
 *   ...
 *   return <>{ConfirmUI}...</>
 */
export function useConfirm() {
  const [state, setState] = useState<{
    options: ConfirmOptions;
    resolve: (v: boolean) => void;
  } | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setState({ options, resolve });
    });
  }, []);

  function close(result: boolean) {
    state?.resolve(result);
    setState(null);
  }

  const ConfirmUI = (
    <AlertDialog open={!!state} onOpenChange={(open) => !open && close(false)}>
      <AlertDialogContent className="rounded-2xl max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{state?.options.title}</AlertDialogTitle>
          {state?.options.description && (
            <AlertDialogDescription>{state.options.description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl" onClick={() => close(false)}>
            {state?.options.cancelText || "Cancelar"}
          </AlertDialogCancel>
          <AlertDialogAction
            className={`rounded-xl font-bold ${
              state?.options.destructive
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-stone-900 hover:bg-stone-800 text-white"
            }`}
            onClick={() => close(true)}
          >
            {state?.options.confirmText || "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { confirm, ConfirmUI };
}
