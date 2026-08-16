"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CatalogContent, Content, SiteContent } from "@/lib/content-types";

/**
 * Контент прокидывается из серверного layout в клиентские компоненты.
 * Так секции остаются интерактивными, а тексты берутся из JSON,
 * который правит админка.
 */

const ContentContext = createContext<Content | null>(null);

export function ContentProvider({ value, children }: { value: Content; children: ReactNode }) {
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): Content {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent вызван вне ContentProvider");
  return ctx;
}

export function useSiteContent(): SiteContent {
  return useContent().site;
}

/** Контакты и название — самая частая нужда, поэтому отдельным хуком. */
export function useSite() {
  return useContent().site.site;
}

export function useCatalog(): CatalogContent {
  return useContent().catalog;
}
