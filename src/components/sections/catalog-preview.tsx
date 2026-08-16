"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { asset } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatPrice, minPrice, productImage } from "@/lib/content-types";
import { useCatalog } from "@/lib/content";

/** Витрина категорий на главной: три карточки со ссылкой в каталог. */
export function CatalogPreview() {
  const { categories: CATEGORIES, products: PRODUCTS } = useCatalog();
  // Пока каталог пуст, витрина на главной не нужна.
  if (PRODUCTS.length === 0) return null;

  return (
    <section className="section-y">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow="Каталог"
            title="Каталог производимой продукции"
            subtitle="Рельсовые подвесные системы, тросовые системы и аксессуары к ним."
          />
        </Reveal>

        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {CATEGORIES.filter((c) => PRODUCTS.some((p) => p.category === c.id)).map((c, i) => {
            const items = PRODUCTS.filter((p) => p.category === c.id);
            const from = Math.min(...items.map(minPrice));
            return (
              <Reveal as="li" key={c.id} delay={i * 0.07}>
                <Link
                  href="/catalog"
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
                >
                  <div className="grid grid-cols-3 gap-2">
                    {items.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        className="aspect-square overflow-hidden rounded-xl bg-white"
                      >
                        <img
                          src={asset(productImage(p))}
                          alt={p.name}
                          width={760}
                          height={760}
                          loading="lazy"
                          decoding="async"
                          className="size-full object-contain p-1.5"
                        />
                      </div>
                    ))}
                  </div>

                  <h3 className="mt-5 text-xl font-bold leading-tight tracking-tight">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>

                  <div className="mt-auto flex items-end justify-between pt-5">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">
                        {items.length} позиций · от
                      </div>
                      <div className="text-2xl font-extrabold tracking-tight">
                        {formatPrice(from)}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                      В каталог
                      <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
