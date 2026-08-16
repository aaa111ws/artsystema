"use client";

import { Check, Plus, Weight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useLeadModal } from "@/lib/lead-modal";
import { asset, cn } from "@/lib/utils";
import { formatPrice, productImage, type Product } from "@/lib/content-types";

/** Фото товара на белой подложке. Если снимка нет — рисуем схему профиля. */
function ProductMedia({ product }: { product: Product }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <div className="relative h-36 overflow-hidden rounded-xl bg-white sm:h-40">
        <img
          src={asset(productImage(product))}
          alt={product.name}
          width={760}
          height={760}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="size-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.06]"
        />
      </div>
    );
  }

  return <ProductGlyph product={product} />;
}

function ProductGlyph({ product }: { product: Product }) {
  const isCable = product.category === "cable";
  return (
    <div className="relative h-36 overflow-hidden rounded-xl bg-gradient-to-br from-ink to-ink-soft sm:h-40">
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(hsl(var(--primary))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary))_1px,transparent_1px)] [background-size:22px_22px]" />
      {isCable ? (
        <svg
          viewBox="0 0 200 120"
          className="absolute inset-0 size-full text-primary"
          aria-hidden="true"
        >
          <rect x="20" y="18" width="160" height="7" rx="3" className="fill-white/25" />
          <line x1="80" y1="25" x2="80" y2="86" stroke="currentColor" strokeWidth="1.6" />
          <line x1="124" y1="25" x2="124" y2="72" stroke="currentColor" strokeWidth="1.6" />
          <rect x="74" y="84" width="12" height="16" rx="3" fill="currentColor" />
          <rect x="118" y="70" width="12" height="16" rx="3" fill="currentColor" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 200 120"
          className="absolute inset-0 size-full text-primary"
          aria-hidden="true"
        >
          <rect x="16" y="20" width="168" height="10" rx="4" className="fill-white/25" />
          <rect x="16" y="30" width="168" height="4" rx="2" fill="currentColor" opacity=".7" />
          <line x1="70" y1="34" x2="70" y2="58" stroke="white" strokeOpacity=".45" strokeWidth="1.4" />
          <line x1="140" y1="34" x2="140" y2="58" stroke="white" strokeOpacity=".45" strokeWidth="1.4" />
          <rect x="52" y="58" width="36" height="44" rx="3" className="fill-white/15 stroke-white/40" />
          <rect x="118" y="58" width="44" height="34" rx="3" className="fill-white/15 stroke-white/40" />
        </svg>
      )}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const { add } = useCart();
  const { open } = useLeadModal();
  const variant = product.variants[variantIndex];

  function handleAdd() {
    add({
      id: `${product.id}-${variantIndex}`,
      name: product.name,
      variant: variant.label,
      price: variant.price,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-ink/10 sm:p-5">
      <ProductMedia product={product} />

      <div className="mt-4 flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold leading-tight tracking-tight">{product.name}</h3>
        {/* Нагрузки в прайсе есть не у всех позиций — бейдж просто не выводим. */}
        {product.load && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
            <Weight className="size-3.5 text-primary" />
            {product.load}
          </span>
        )}
      </div>

      {product.description && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      )}

      <div className={cn("mt-4", product.variants.length < 2 && "hidden")}>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Исполнение
        </div>
        <div className="flex flex-wrap gap-1.5">
          {product.variants.map((v, i) => (
            <button
              key={v.label}
              type="button"
              onClick={() => setVariantIndex(i)}
              aria-pressed={i === variantIndex}
              className={cn(
                "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition",
                i === variantIndex
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* mt-auto прижимает блок цены к низу — карточки в ряду выравниваются. */}
      <div className="mt-auto pt-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-2xl font-extrabold tracking-tight">
              {formatPrice(variant.price)}
            </div>
          </div>
          <button
            type="button"
            onClick={() => open(`Каталог — ${product.name} (${variant.label})`)}
            className="text-sm font-semibold text-primary underline-offset-4 transition hover:underline"
          >
            Заказать
          </button>
        </div>

        <Button
          onClick={handleAdd}
          variant={justAdded ? "outline" : "primary"}
          className="mt-3 w-full"
        >
          {justAdded ? (
            <>
              <Check className="size-4" /> Добавлено
            </>
          ) : (
            <>
              <Plus className="size-4" /> В корзину
            </>
          )}
        </Button>
      </div>
    </article>
  );
}
