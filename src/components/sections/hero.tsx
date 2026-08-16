"use client";

import { Check } from "lucide-react";
import { LeadForm } from "@/components/ui/lead-form";
import { useSiteContent } from "@/lib/content";

/**
 * Первый экран рендерится на сервере, появление сделано CSS-анимацией:
 * заголовок виден сразу и не ждёт гидратации JS (иначе проваливается LCP).
 * Тексты — дословно с artsystema.ru.
 */
export function Hero() {
  const { hero: HERO, site: SITE, stats: STATS } = useSiteContent();
  return (
    <section id="top" className="relative overflow-hidden border-b border-border bg-background">
      {/* Светлый фон с холодным пятном акцента — как на референсе. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-52 -top-56 size-[46rem] rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="container-x relative pb-14 pt-24 lg:pb-20 lg:pt-36">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">
              <span className="size-1.5 rounded-full bg-primary" />
              {HERO.topbar}
            </div>

            <h1
              className="animate-fade-in mt-6 text-balance text-[2.15rem] font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.5rem]"
              style={{ animationDelay: "60ms" }}
            >
              Подвесные системы для картин и фотографий{" "}
              <span className="text-primary">от производителя</span>
            </h1>

            <ul
              className="animate-fade-in mt-8 grid gap-3 sm:grid-cols-3"
              style={{ animationDelay: "140ms" }}
            >
              {HERO.points.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-2.5 rounded-xl border border-border bg-card px-4 py-3.5 text-sm font-semibold leading-snug"
                >
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/10">
                    <Check className="size-3.5 text-primary" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <dl
              className="animate-fade-in mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4"
              style={{ animationDelay: "220ms" }}
            >
              {STATS.map((s) => (
                <div key={s.label} className="bg-card px-4 py-5 text-center">
                  <dt className="text-xl font-extrabold tracking-tight text-primary sm:text-2xl">
                    {s.value}
                  </dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{s.label}</dd>
                </div>
              ))}
            </dl>

            <p
              className="animate-fade-in mt-6 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base"
              style={{ animationDelay: "260ms" }}
            >
              Компания {SITE.name} занимается продажей и установкой подвесных систем для картин и
              фотографий уже более {SITE.years} лет. Бесплатный подбор системы, выезд замерщика,
              монтаж любой сложности.
            </p>
          </div>

          {/* Форма прямо на первом экране — как на оригинале. */}
          <div className="animate-fade-in lg:pt-2" style={{ animationDelay: "180ms" }}>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-ink/5 sm:p-7">
              <h2 className="text-2xl font-extrabold tracking-tight">{HERO.formTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{HERO.formText}</p>
              <div className="mt-5">
                <LeadForm source="Первый экран" compact submitLabel={HERO.formButton} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
