"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { CartProvider } from "@/lib/cart";
import { ContentProvider } from "@/lib/content";
import { LeadModalProvider } from "@/lib/lead-modal";
import type { Content } from "@/lib/content-types";

export function Providers({ content, children }: { content: Content; children: ReactNode }) {
  return (
    <ContentProvider value={content}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <CartProvider>
          <LeadModalProvider>{children}</LeadModalProvider>
        </CartProvider>
      </ThemeProvider>
    </ContentProvider>
  );
}
