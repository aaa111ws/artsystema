"use client";

import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { useSiteContent } from "@/lib/content";

export function Services() {
  const { services: SERVICES } = useSiteContent();
  return (
    <section id="services" className="section-y relative overflow-hidden bg-ink text-ink-foreground">
      <div
        className="pointer-events-none absolute -right-32 top-0 size-[30rem] rounded-full bg-primary/15 blur-[120px]"
        aria-hidden="true"
      />
      <div className="container-x relative">
        <Reveal>
          <SectionHeading
            tone="light"
            eyebrow="Услуги"
            title="Берём на себя весь путь — от подбора до гарантии"
            subtitle="Работаем под ключ: вам не нужно искать отдельно продавца профиля, замерщика и монтажника."
          />
        </Reveal>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.07}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-white/[0.07]">
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-xl bg-primary/15">
                    <Icon name={s.icon} className="size-6 text-primary" />
                  </span>
                  <span className="text-4xl font-extrabold text-white/10">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-foreground/70">{s.text}</p>
                <div className="mt-4 inline-flex rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                  {s.note}
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
