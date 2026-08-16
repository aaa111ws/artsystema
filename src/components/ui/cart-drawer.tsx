"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/ui/lead-form";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/content-types";

export function CartDrawer() {
  const { items, total, count, isOpen, close, setQty, remove, clear } = useCart();
  const [checkout, setCheckout] = useState(false);

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        close();
        setCheckout(false);
      }}
      title={checkout ? "Оформление заказа" : `Корзина${count ? ` · ${count}` : ""}`}
      side
    >
      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <ShoppingBag className="size-12 text-muted-foreground/40" />
          <p className="font-semibold">Корзина пуста</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Добавьте позиции из каталога — или оставьте заявку, и мы соберём комплект под ваши
            работы бесплатно.
          </p>
        </div>
      ) : checkout ? (
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="mb-5 rounded-xl bg-muted/60 px-4 py-3 text-sm">
            <div className="font-semibold">
              {count} поз. на {formatPrice(total)}
            </div>
            <p className="mt-1 text-muted-foreground">
              Состав корзины уйдёт вместе с заявкой — менеджер проверит комплектность и пришлёт
              счёт.
            </p>
          </div>
          <LeadForm source="Корзина" withCart onSuccess={() => setCheckout(false)} />
        </div>
      ) : (
        <>
          <ul className="min-h-0 flex-1 divide-y divide-border overflow-y-auto px-5 sm:px-6">
            {items.map((item) => (
              <li key={item.id} className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.variant}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    aria-label={`Удалить ${item.name}`}
                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-red-500"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() => setQty(item.id, item.qty - 1)}
                      aria-label="Уменьшить количество"
                      className="px-3 py-2 text-muted-foreground transition hover:text-foreground"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-bold">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(item.id, item.qty + 1)}
                      aria-label="Увеличить количество"
                      className="px-3 py-2 text-muted-foreground transition hover:text-foreground"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <div className="font-bold">{formatPrice(item.price * item.qty)}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-border px-5 py-4 sm:px-6">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Итого</span>
              <span className="text-2xl font-extrabold tracking-tight">{formatPrice(total)}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Без учёта доставки и монтажа — рассчитаем после подтверждения заказа.
            </p>
            <Button size="lg" className="mt-4 w-full" onClick={() => setCheckout(true)}>
              Оформить заявку
            </Button>
            <button
              type="button"
              onClick={clear}
              className="mt-2 w-full py-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              Очистить корзину
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
