"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type LeadModalValue = {
  isOpen: boolean;
  /** Откуда пришла заявка — уходит в скрытое поле формы и в аналитику. */
  source: string;
  open: (source?: string) => void;
  close: () => void;
};

const LeadModalContext = createContext<LeadModalValue | null>(null);

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [source, setSource] = useState("Шапка сайта");

  const value = useMemo<LeadModalValue>(
    () => ({
      isOpen,
      source,
      open: (src) => {
        if (src) setSource(src);
        setOpen(true);
      },
      close: () => setOpen(false),
    }),
    [isOpen, source],
  );

  return <LeadModalContext.Provider value={value}>{children}</LeadModalContext.Provider>;
}

export function useLeadModal() {
  const ctx = useContext(LeadModalContext);
  if (!ctx) throw new Error("useLeadModal должен вызываться внутри <LeadModalProvider>");
  return ctx;
}
