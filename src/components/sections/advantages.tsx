"use client";

import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { useSiteContent } from "@/lib/content";

export function Advantages() {
  const { advantages: ADVANTAGES } = useSiteContent();
  return (
    <section id="advantages" className="section-y bg-muted/40">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow="Преимущества"
            align="center"
            title="Почему подвесная система, а не гвоздь в стене"
            subtitle="Один раз смонтированный рельс закрывает вопрос развески на годы вперёд — и для одной картины, и для целой экспозиции."
          />
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map((a, i) => (
            <Reveal as="li" key={a.title} delay={i * 0.06}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                <span className="grid size-12 place-items-center rounded-xl bg-primary/10 transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon name={a.icon} className="size-6 text-primary transition group-hover:text-primary-foreground" />
                </span>
                <h3 className="mt-5 text-lg font-bold leading-tight tracking-tight">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
