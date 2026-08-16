"use client";

import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { Logo } from "@/components/layout/logo";
import { useSiteContent, useCatalog } from "@/lib/content";

export function Footer() {
  const { nav: NAV, site: SITE } = useSiteContent();
  const { categories: CATEGORIES } = useCatalog();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="container-x py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-foreground/65">
              Продажа и установка подвесных систем для картин, фотографий и изображений.
              Более {SITE.years} лет на рынке, европейское производство, доставка по всей России.
            </p>
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              <WhatsAppIcon className="size-4" />
              Написать в WhatsApp
            </a>
          </div>

          <nav>
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink-foreground/50">
              Разделы
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-ink-foreground/75 transition hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink-foreground/50">
              Каталог
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link href="/catalog" className="text-ink-foreground/75 transition hover:text-primary">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink-foreground/50">
              Контакты
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={SITE.phoneHref}
                  className="flex items-center gap-2.5 text-lg font-bold tracking-tight transition hover:text-primary"
                >
                  <Phone className="size-4 shrink-0 text-primary" />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={SITE.emailHref}
                  className="flex items-center gap-2.5 text-ink-foreground/75 transition hover:text-primary"
                >
                  <Mail className="size-4 shrink-0 text-primary" />
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-ink-foreground/75">
                <Clock className="size-4 shrink-0 text-primary" />
                {SITE.schedule}
              </li>
              <li className="flex items-center gap-2.5 text-ink-foreground/75">
                <MapPin className="size-4 shrink-0 text-primary" />
                {SITE.city}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-ink-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {SITE.name}. Подвесные системы для картин и фотографий.
          </span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <Link href="/privacy" className="transition hover:text-primary">
              Политика конфиденциальности
            </Link>
            <span>Цены на сайте не являются публичной офертой.</span>
          </div>
        </div>
      </div>

      {/* Запас под фиксированную мобильную панель действий. */}
      <div className="h-20 sm:hidden" />
    </footer>
  );
}
