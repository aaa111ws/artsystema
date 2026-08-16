"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Check, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useLeadModal } from "@/lib/lead-modal";
import { useSiteContent } from "@/lib/content";

export function FloatingActions() {
  const { site: SITE } = useSiteContent();
  const [showTop, setShowTop] = useState(false);
  const { lastAdded, open: openCart } = useCart();
  const { open: openLead } = useLeadModal();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Тост подтверждения — над нижней панелью на мобильных. */}
      <AnimatePresence>
        {lastAdded && (
          <motion.button
            type="button"
            onClick={openCart}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed inset-x-4 bottom-24 z-[60] flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left shadow-2xl sm:inset-x-auto sm:left-6 sm:bottom-6 sm:max-w-sm"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10">
              <Check className="size-5 text-primary" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold">Добавлено в корзину</span>
              <span className="block truncate text-xs text-muted-foreground">{lastAdded}</span>
            </span>
            <span className="ml-auto shrink-0 text-xs font-bold uppercase tracking-wide text-primary">
              Открыть
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Плавающие кнопки: на мобильных приподняты над нижней панелью. */}
      <div className="fixed bottom-[5.25rem] right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {showTop && (
            <motion.button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Наверх"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="grid size-11 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-lg transition hover:text-primary"
            >
              <ArrowUp className="size-5" />
            </motion.button>
          )}
        </AnimatePresence>

        <a
          href={SITE.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написать в WhatsApp"
          className="group relative grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/30 transition hover:scale-105"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.5s]" />
          <WhatsAppIcon className="relative size-8" />
        </a>
      </div>

      {/* Нижняя панель действий — только мобильные. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-lg sm:hidden">
        <div className="grid grid-cols-2 gap-2 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <a
            href={SITE.phoneHref}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border font-semibold"
          >
            <Phone className="size-4 text-primary" />
            Позвонить
          </a>
          <button
            type="button"
            onClick={() => openLead("Мобильная панель")}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground shadow-lg shadow-primary/25"
          >
            Оставить заявку
          </button>
        </div>
      </div>
    </>
  );
}
