"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ProductCard } from "@/components/ui/product-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { useLeadModal } from "@/lib/lead-modal";
import { cn } from "@/lib/utils";
import { type CategoryId } from "@/lib/content-types";
import { useCatalog } from "@/lib/content";

type Filter = CategoryId | "all";

export function Catalog() {
  const { categories: CATEGORIES, products: PRODUCTS } = useCatalog();

  const TABS: { id: Filter; label: string }[] = [
    { id: "all", label: "Все системы" },
    ...CATEGORIES.map((c) => ({ id: c.id as Filter, label: c.short })),
  ];
  const [filter, setFilter] = useState<Filter>("all");
  const { open } = useLeadModal();

  const products = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);
  const activeCategory = CATEGORIES.find((c) => c.id === filter);

  return (
    <section id="catalog" className="section-y">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow="Каталог"
            title="Системы, тросы и крепёж"
            subtitle="Цены указаны за единицу товара. Не уверены в комплектации — оставьте заявку: соберём спецификацию под ваши работы бесплатно."
          />
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Категории каталога">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={filter === tab.id}
                onClick={() => setFilter(tab.id)}
                className={cn(
                  "relative rounded-full px-4 py-2.5 text-sm font-semibold transition sm:px-5",
                  filter === tab.id
                    ? "text-primary-foreground"
                    : "border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {filter === tab.id && (
                  <motion.span
                    layoutId="catalog-tab"
                    className="absolute inset-0 rounded-full bg-primary shadow-lg shadow-primary/25"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{tab.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {activeCategory && (
          /* key перезапускает CSS-анимацию при смене вкладки;
             без JS текст просто виден — состояния opacity:0 в разметке нет. */
          <p
            key={activeCategory.id}
            className="animate-fade-in mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground"
          >
            {activeCategory.description}
          </p>
        )}

        {products.length > 0 ? (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <li key={p.id} className="animate-fade-in">
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-border px-6 py-14 text-center">
            <h3 className="text-lg font-bold tracking-tight">Позиции уточняются</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Цены на системы этой категории пришлём по запросу.
            </p>
            <Button className="mt-5" onClick={() => open("Каталог — запрос наличия")}>
              Запросить наличие и цены
            </Button>
          </div>
        )}

        <Reveal delay={0.05}>
          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h3 className="text-lg font-bold tracking-tight">Не нашли нужную позицию?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Оставьте заявку — подберём систему под ваши работы и пришлём спецификацию.
              </p>
            </div>
            <Button size="lg" onClick={() => open("Каталог — подбор спецификации")}>
              Запросить спецификацию
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
