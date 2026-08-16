"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { asset, cn } from "@/lib/utils";
import { useSiteContent } from "@/lib/content";

/** Приводит ввод к виду +7 (999) 123-45-67 по мере набора. */
function maskPhone(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (!digits.startsWith("7")) digits = "7" + digits;
  digits = digits.slice(0, 11);

  const p = digits.slice(1);
  let out = "+7";
  if (p.length > 0) out += ` (${p.slice(0, 3)}`;
  if (p.length >= 3) out += `)`;
  if (p.length > 3) out += ` ${p.slice(3, 6)}`;
  if (p.length > 6) out += `-${p.slice(6, 8)}`;
  if (p.length > 8) out += `-${p.slice(8, 10)}`;
  return out;
}

/** Проверка адреса без крайностей: одна «собака», точка в домене, без пробелов. */
function isEmail(raw: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw.trim());
}

const money = (v: number) => new Intl.NumberFormat("ru-RU").format(v) + " руб.";

type LeadData = {
  name: string;
  phone: string;
  email: string;
  comment: string;
  source: string;
  cart: { items: { name: string; variant: string; price: number; qty: number }[]; total: number } | null;
};

/** Текст письма. Состав заказа — только если заявка пришла из корзины. */
function buildMessage(d: LeadData) {
  const lines = [
    `Источник: ${d.source}`,
    `Имя: ${d.name.trim() || "не указано"}`,
    `Телефон: ${d.phone.trim() || "не указан"}`,
    `E-mail: ${d.email.trim() || "не указан"}`,
    `Комментарий: ${d.comment.trim() || "нет"}`,
  ];

  if (d.cart && d.cart.items.length > 0) {
    lines.push("", "Состав заказа:");
    d.cart.items.forEach((it, i) => {
      const variant = it.variant ? `, ${it.variant}` : "";
      lines.push(
        `${i + 1}. ${it.name}${variant} — ${it.qty} шт. × ${money(it.price)} = ${money(it.price * it.qty)}`,
      );
    });
    lines.push("", `Итого: ${money(d.cart.total)}`);
  } else {
    lines.push("", "Товар не указан — заявка отправлена не из корзины.");
  }

  lines.push("", `Отправлено: ${new Date().toLocaleString("ru-RU")}`);
  return lines.join("\n");
}

const field =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-base text-foreground " +
  "placeholder:text-muted-foreground/70 transition focus:border-primary focus:outline-none " +
  "focus:ring-4 focus:ring-primary/15";

type Props = {
  source: string;
  /** Прикладывать состав корзины к заявке (форма внутри корзины). */
  withCart?: boolean;
  compact?: boolean;
  /** Своя надпись на кнопке (на первом экране — как на оригинале). */
  submitLabel?: string;
  onSuccess?: () => void;
};

export function LeadForm({
  source,
  withCart = false,
  compact = false,
  submitLabel = "Отправить заявку",
  onSuccess,
}: Props) {
  const { site: SITE } = useSiteContent();
  const { items, total, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Телефон при фокусе подставляет «+7 (» — это ещё не значит, что его начали вводить.
    const digits = phone.replace(/\D/g, "");
    const phoneStarted = digits.length > 1;
    const phoneOk = digits.length === 11;
    const emailStarted = email.trim().length > 0;
    const emailOk = isEmail(email);

    if (!phoneOk && !emailOk) {
      if (phoneStarted) {
        setError("Введите номер полностью — перезвоним на него");
      } else if (emailStarted) {
        setError("Проверьте адрес почты");
      } else {
        setError("Оставьте телефон или e-mail — иначе мы не сможем ответить");
      }
      return;
    }
    // Начатое, но неверное второе поле лучше поправить, чем молча отбросить.
    if (phoneStarted && !phoneOk) {
      setError("Введите номер полностью — перезвоним на него");
      return;
    }
    if (emailStarted && !emailOk) {
      setError("Проверьте адрес почты");
      return;
    }
    setError(null);
    setStatus("sending");

    const data: LeadData = {
      name,
      phone,
      email,
      comment,
      source,
      cart: withCart ? { items, total } : null,
    };
    const message = buildMessage(data);
    const fromCart = Boolean(data.cart && data.cart.items.length > 0);

    try {
      // Web3Forms принимает заявки только из браузера — на бесплатном плане
      // отправка со стороны сервера запрещена, поэтому шлём отсюда напрямую.
      const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
      let sent = false;

      if (key) {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: key,
            subject: fromCart
              ? `Заявка с сайта — заказ из корзины (${source})`
              : `Заявка с сайта — без товара (${source})`,
            from_name: `Сайт ${SITE.name}`,
            // Чтобы «Ответить» в почте писало клиенту, а не нам самим.
            replyto: isEmail(email) ? email.trim() : undefined,
            message,
          }),
        });
        sent = res.ok;
      }

      // Дубль на свой сервер: попадёт в лог, даже если внешний сервис молчит.
      const res = await fetch(asset("/api/lead"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, message }),
      });

      if (!sent && !res.ok) throw new Error("Ошибка отправки");
      setStatus("done");
      if (withCart) clear();
      onSuccess?.();
    } catch {
      // Заявку всё равно можно оставить по телефону — не оставляем человека в тупике.
      setStatus("idle");
      setError(`Не удалось отправить. Позвоните нам: ${SITE.phone}`);
    }
  }

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-10 text-center"
      >
        <CheckCircle2 className="size-12 text-primary" />
        <h3 className="text-xl font-bold">Заявка принята</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Спасибо! Менеджер свяжется с вами в ближайшее время — обычно в течение рабочего часа.
          Ежедневно с 9:00 до 19:00.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setName("");
            setPhone("");
            setEmail("");
            setComment("");
          }}
          className="mt-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Отправить ещё одну заявку
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", compact && "space-y-3")} noValidate>
      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Имя</span>
          <input
            className={field}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Как к вам обращаться"
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Телефон</span>
          <input
            className={field}
            value={phone}
            onChange={(e) => setPhone(maskPhone(e.target.value))}
            onFocus={() => !phone && setPhone("+7 (")}
            placeholder="+7 (___) ___-__-__"
            inputMode="tel"
            autoComplete="tel"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">E-mail</span>
        <input
          className={field}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.ru"
          type="email"
          inputMode="email"
          autoComplete="email"
        />
      </label>

      <p className="text-xs text-muted-foreground">
        Оставьте телефон или e-mail — ответим тем способом, который вам удобнее.
      </p>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">Что нужно сделать</span>
        <textarea
          className={cn(field, "min-h-[110px] resize-y")}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Например: 4 картины в гостиной, стена 5 м, гипсокартон. Нужен подбор и монтаж."
        />
      </label>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <Loader2 className="size-5 animate-spin" /> Отправляем…
          </>
        ) : (
          <>
            <Send className="size-5" /> {submitLabel}
          </>
        )}
      </Button>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
        Мы не передаём контакты третьим лицам.
      </p>
    </form>
  );
}
