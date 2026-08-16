"use client";

import { Reveal } from "@/components/ui/reveal";
import { asset } from "@/lib/utils";
import { useSiteContent } from "@/lib/content";

/** Лента логотипов заказчиков — сразу под первым экраном. */
export function Clients() {
  const { clients: CLIENTS } = useSiteContent();
  return (
    <section id="clients" className="border-b border-border bg-muted/40 py-12 lg:py-16">
      <div className="container-x">
        <Reveal>
          <div className="text-center">
            <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">Нам доверяют</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Подвесные системы ART SYSTEMA установлены в музеях, галереях и офисах крупных
              компаний.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {CLIENTS.map((c) => (
              <li key={c.src}>
                {/* Файлы обрезаны по краю знака и приведены к одной высоте,
                    поэтому лого стоят ровно без ручных отступов. */}
                <div className="flex h-24 items-center justify-center rounded-xl border border-border bg-card px-5 transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                  <img
                    src={asset(c.src)}
                    alt={c.name}
                    title={c.name}
                    height={128}
                    loading="lazy"
                    decoding="async"
                    className="max-h-16 w-auto max-w-full"
                  />
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
