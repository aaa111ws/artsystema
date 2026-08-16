"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { asset } from "@/lib/utils";
import { useSiteContent } from "@/lib/content";

export function Works({ preview = false }: { preview?: boolean } = {}) {
  const { works: WORKS } = useSiteContent();
  const [lightbox, setLightbox] = useState<number | null>(null);

  // На главной — витрина из 6 фото, на своей странице — вся галерея.
  const visible = preview ? WORKS.slice(0, 6) : WORKS;

  /**
   * Сетка на 6 колонок, обычная плитка занимает 2 — получается ряд из трёх.
   * Если в хвосте остаётся два фото, они растягиваются на три колонки каждое
   * и закрывают ряд целиком: пустых ячеек в сетке не остаётся.
   */
  const tail = visible.length % 3;

  const move = useCallback((step: number) => {
    setLightbox((current) => {
      if (current === null) return current;
      // Листание по кругу: с последнего кадра — снова на первый.
      return (current + step + WORKS.length) % WORKS.length;
    });
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox, move]);

  const current = lightbox === null ? null : WORKS[lightbox];

  return (
    <section id="works" className={preview ? "section-y" : "section-y pt-12 lg:pt-16"}>
      <div className="container-x">
        {/* На своей странице заголовок уже дан в шапке — здесь он был бы вторым. */}
        {preview && (
          <Reveal>
            <SectionHeading
              title="Наши работы"
              subtitle="Галереи, офисы, административные здания и частные интерьеры. На всех объектах экспозицию можно менять без единого нового отверстия в стене."
            />
          </Reveal>
        )}

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {visible.map((w, i) => (
            <Reveal
              as="li"
              key={w.src}
              delay={Math.min(i, 5) * 0.06}
              className={
                tail === 2 && i >= visible.length - 2 ? "lg:col-span-3" : "lg:col-span-2"
              }
            >
              <button
                type="button"
                onClick={() => setLightbox(WORKS.indexOf(w))}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted text-left"
              >
                <img
                  src={asset(w.src)}
                  alt={`${w.title} — ${w.place}`}
                  width={1100}
                  height={825}
                  /* Первый ряд виден почти сразу после скролла к секции —
                     его грузим сразу, остальное по мере появления. */
                  loading={i < 3 ? "eager" : "lazy"}
                  decoding="async"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-ink/50 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                  <Expand className="size-4" />
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* Просмотр фото во весь экран */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {current && (
              <motion.div
                className="fixed inset-0 z-[110] flex flex-col bg-ink/95 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                role="dialog"
                aria-modal="true"
                aria-label={current.title}
              >
                <div className="flex items-center justify-end gap-4 px-5 py-4 text-ink-foreground">
                  <div className="flex items-center gap-3">
                    <span className="text-sm tabular-nums text-ink-foreground/60">
                      {(lightbox ?? 0) + 1} / {WORKS.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLightbox(null)}
                      aria-label="Закрыть"
                      className="rounded-full p-2 transition hover:bg-white/10"
                    >
                      <X className="size-5" />
                    </button>
                  </div>
                </div>

                <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-6">
                  <motion.img
                    key={current.src}
                    src={asset(current.src)}
                    alt={current.title}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
                  />

                  <button
                    type="button"
                    onClick={() => move(-1)}
                    aria-label="Предыдущее фото"
                    className="absolute left-2 grid size-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:left-6 sm:size-14"
                  >
                    <ChevronLeft className="size-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(1)}
                    aria-label="Следующее фото"
                    className="absolute right-2 grid size-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:right-6 sm:size-14"
                  >
                    <ChevronRight className="size-6" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
