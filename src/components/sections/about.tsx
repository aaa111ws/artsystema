"use client";

import { Award, MapPin, PackageCheck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { useSiteContent } from "@/lib/content";

export function About() {
  const { about: ABOUT, site: SITE } = useSiteContent();

  const FACTS = [
    {
      icon: Award,
      value: `${SITE.years}+ лет`,
      title: "На рынке подвесных систем",
      text: "С 2013 года оснащаем галереи, музеи, офисы и частные интерьеры.",
    },
    {
      icon: MapPin,
      value: "Вся Россия",
      title: "География поставок",
      text: "Москва и область — своей службой, регионы — транспортными компаниями.",
    },
    {
      icon: PackageCheck,
      value: "12 месяцев",
      title: "Гарантия",
      text: "На оборудование и монтажные работы, включая выезд по гарантийному случаю.",
    },
  ];

  return (
    <section id="about" className="section-y">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="О компании"
              title={ABOUT.title}
              subtitle={ABOUT.lead}
            />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              {ABOUT.paragraphs.map((text) => (
                <p key={text.slice(0, 40)}>{text}</p>
              ))}
            </div>
          </Reveal>

          <div className="space-y-4">
            {FACTS.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="flex gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-lg sm:p-6">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10">
                    <f.icon className="size-6 text-primary" />
                  </span>
                  <div>
                    <div className="text-xl font-extrabold tracking-tight">{f.value}</div>
                    <div className="mt-0.5 text-sm font-semibold">{f.title}</div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
