import { NextResponse } from "next/server";

/**
 * Приём заявки — страховочный канал и журнал.
 *
 * Само письмо отправляет браузер напрямую в Web3Forms: на бесплатном плане
 * сервис принимает заявки только с клиента, серверные запросы отклоняет
 * (403 «Use our API in client side»). Ключ у Web3Forms публичный, поэтому
 * он живёт в NEXT_PUBLIC_WEB3FORMS_KEY и виден в коде страницы — это штатно.
 *
 * Здесь заявка проверяется и пишется в лог, чтобы не потеряться,
 * если внешний сервис недоступен.
 */

type CartItem = { name: string; variant: string; price: number; qty: number };

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

const money = (v: number) => new Intl.NumberFormat("ru-RU").format(v) + " руб.";

/** Состав заказа. Пусто, если заявка пришла не из корзины. */
function renderCart(cart: unknown): string {
  if (!cart || typeof cart !== "object") return "";
  const { items, total } = cart as { items?: CartItem[]; total?: number };
  if (!Array.isArray(items) || items.length === 0) return "";

  const lines = items.map((it, i) => {
    const qty = Number(it.qty) || 1;
    const sum = (Number(it.price) || 0) * qty;
    const variant = it.variant ? `, ${it.variant}` : "";
    return `${i + 1}. ${it.name}${variant} — ${qty} шт. × ${money(it.price)} = ${money(sum)}`;
  });

  const sum = typeof total === "number"
    ? total
    : items.reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.qty) || 1), 0);

  return ["", "Состав заказа:", ...lines, "", `Итого: ${money(sum)}`].join("\n");
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  const name = String(payload.name ?? "").trim();
  const phone = String(payload.phone ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const comment = String(payload.comment ?? "").slice(0, 2000).trim();
  const source = String(payload.source ?? "Сайт").trim();

  const phoneOk = phone.replace(/\D/g, "").length === 11;
  const emailOk = isEmail(email);

  // Нужен хотя бы один рабочий контакт — иначе на заявку нечем ответить.
  if (!phoneOk && !emailOk) {
    return NextResponse.json(
      { ok: false, error: "Укажите телефон или e-mail" },
      { status: 422 },
    );
  }

  const cartText = renderCart(payload.cart);

  const body = [
    `Источник: ${source}`,
    `Имя: ${name || "не указано"}`,
    `Телефон: ${phoneOk ? phone : "не указан"}`,
    `E-mail: ${emailOk ? email : "не указан"}`,
    `Комментарий: ${comment || "нет"}`,
    cartText || "\nТовар не указан — заявка отправлена не из корзины.",
    "",
    `Отправлено: ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })} (МСК)`,
  ].join("\n");

  console.info("[lead]", body);

  return NextResponse.json({ ok: true });
}
