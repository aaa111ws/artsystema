"use client";

import { Banknote, Building, CreditCard, MapPin, Truck, Wallet } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { useSiteContent } from "@/lib/content";

const PAYMENT_ICONS = [Banknote, Building, CreditCard, Wallet];

export function Delivery() {
  const { delivery: DELIVERY } = useSiteContent();
  return (
    <section id="delivery" className="section-y bg-muted/40">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow="Доставка и оплата"
            title="Привезём в любой регион и подстроимся под способ оплаты"
            subtitle="Стоимость доставки считаем при подтверждении заказа — она зависит от габаритов профиля и адреса."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {[
            { data: DELIVERY.moscow, icon: MapPin },
            { data: DELIVERY.russia, icon: Truck },
          ].map(({ data, icon: Ico }, i) => (
            <Reveal key={data.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 sm:p-8">
                <span className="grid size-12 place-items-center rounded-xl bg-primary/10">
                  <Ico className="size-6 text-primary" />
                </span>
                <h3 className="mt-5 text-xl font-bold tracking-tight">{data.title}</h3>
                <ul className="mt-4 space-y-3">
                  {data.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h3 className="text-xl font-bold tracking-tight">Способы оплаты</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Работаем с физическими и юридическими лицами. Возможна частичная оплата: аванс при
              заказе, остаток — после монтажа.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {DELIVERY.payment.map((p, i) => {
                const Ico = PAYMENT_ICONS[i % PAYMENT_ICONS.length];
                return (
                  <li
                    key={p}
                    className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3.5 text-sm font-semibold"
                  >
                    <Ico className="size-5 shrink-0 text-primary" />
                    {p}
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
