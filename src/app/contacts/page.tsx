"use client";

import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { PageHero } from "@/components/layout/page-hero";
import { Contact } from "@/components/sections/contact";
import { Reveal } from "@/components/ui/reveal";
import { useSiteContent } from "@/lib/content";

export default function ContactsPage() {
  const { site: SITE } = useSiteContent();

  const CARDS = [
    { icon: Phone, label: "Телефон", value: SITE.phone, href: SITE.phoneHref },
    { icon: Mail, label: "Почта", value: SITE.email, href: SITE.emailHref },
    { icon: WhatsAppIcon, label: "WhatsApp", value: "Написать в мессенджер", href: SITE.whatsapp },
    { icon: Clock, label: "Режим работы", value: "Работаем ежедневно с 9:00 до 19:00" },
    { icon: MapPin, label: "География работ", value: "Москва, область и все регионы России" },
  ];

  return (
    <>
      <PageHero
        title="Остались вопросы?"
        eyebrow="Контакты"
        subtitle="Оставьте заявку и мы перезвоним Вам в течении 5 минут."
      />

      <section className="section-y">
        <div className="container-x">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CARDS.map((c, i) => {
              const inner = (
                <>
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10">
                    <c.icon className="size-5 text-primary" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                      {c.label}
                    </span>
                    <span className="mt-0.5 block text-lg font-bold tracking-tight">{c.value}</span>
                  </span>
                </>
              );
              return (
                <Reveal as="li" key={c.label} delay={i * 0.06}>
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-5">
                      {inner}
                    </div>
                  )}
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <Contact />
    </>
  );
}
