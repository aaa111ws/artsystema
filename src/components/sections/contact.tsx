"use client";

import { Clock, Mail, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { LeadForm } from "@/components/ui/lead-form";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { useSiteContent } from "@/lib/content";

export function Contact() {
  const { site: SITE } = useSiteContent();
  return (
    <section id="contact" className="section-y">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <Reveal>
            <SectionHeading
              eyebrow="Заявка"
              title={
                <>
                  Подберём систему <span className="text-primary">бесплатно</span>
                </>
              }
              subtitle="Оставьте телефон — перезвоним, уточним детали и назовём точную стоимость с доставкой и монтажом. Замерщик выезжает в течение 24 часов."
            />

            <ul className="mt-8 space-y-4">
              <li>
                <a
                  href={SITE.phoneHref}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10">
                    <Phone className="size-5 text-primary" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                      Телефон
                    </span>
                    <span className="block text-lg font-bold tracking-tight transition group-hover:text-primary">
                      {SITE.phone}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={SITE.emailHref}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10">
                    <Mail className="size-5 text-primary" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                      Почта
                    </span>
                    <span className="block text-lg font-bold tracking-tight transition group-hover:text-primary">
                      {SITE.email}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition hover:border-[#25D366]/50"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#25D366]/10">
                    <WhatsAppIcon className="size-5 text-[#25D366]" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                      WhatsApp
                    </span>
                    <span className="block text-lg font-bold tracking-tight">
                      Написать в мессенджер
                    </span>
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-3 px-1 text-sm text-muted-foreground">
                <Clock className="size-4 text-primary" />
                {SITE.schedule}
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-ink/5 sm:p-8">
              <h3 className="text-xl font-bold tracking-tight">Оставить заявку</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Заполните форму — ответим в рабочее время в течение часа.
              </p>
              <div className="mt-6">
                <LeadForm source="Форма на странице" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
