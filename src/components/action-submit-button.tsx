"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type ActionSubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  className: string;
};

export function ActionSubmitButton({
  children,
  pendingLabel = "Traitement...",
  className,
}: ActionSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button className={className} disabled={pending}>
      {pending ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
