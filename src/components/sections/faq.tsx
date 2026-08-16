"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/lib/content";

export function Faq() {
  const { faq: FAQ } = useSiteContent();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-y bg-muted/40">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow="Вопросы и ответы"
            align="center"
            title="Частые вопросы"
            subtitle="Если нужного вопроса нет — позвоните или напишите в WhatsApp, ответим на любой."
          />
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {FAQ.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={item.q} delay={i * 0.05}>
                <div
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-card transition-colors",
                    isOpen ? "border-primary/40" : "border-border",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                  >
                    <span className="text-base font-bold tracking-tight sm:text-lg">{item.q}</span>
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-full transition-all duration-300",
                        isOpen ? "rotate-45 bg-primary text-primary-foreground" : "bg-muted text-primary",
                      )}
                    >
                      <Plus className="size-4" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:text-[0.95rem]">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
