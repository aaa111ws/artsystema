import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Вход в админку: один пароль из ADMIN_PASSWORD.
 * После входа выдаём подписанную cookie — в ней нет пароля, только отметка
 * времени и подпись, поэтому подделать её без секрета нельзя.
 */

export { SESSION_COOKIE } from "@/lib/session-cookie";

/** Сколько живёт сессия. */
const MAX_AGE_SEC = 60 * 60 * 12;

function secret() {
  // Отдельный секрет не обязателен: если его нет, подписываем паролем.
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

/** Сравнение без утечки времени — чтобы подбор по времени ответа не работал. */
function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function isPasswordValid(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(input, expected);
}

export function createToken() {
  const issued = Date.now().toString();
  return `${issued}.${sign(issued)}`;
}

export function isTokenValid(token: string | undefined) {
  if (!token || !secret()) return false;
  const [issued, mac] = token.split(".");
  if (!issued || !mac) return false;
  if (!safeEqual(mac, sign(issued))) return false;
  const age = (Date.now() - Number(issued)) / 1000;
  return age >= 0 && age < MAX_AGE_SEC;
}

/**
 * Флаг secure ставим только когда соединение действительно защищённое:
 * иначе браузер отбросит cookie и в панель будет не войти по http://
 * (пока у сайта нет домена и сертификата). За прокси протокол приходит
 * в заголовке X-Forwarded-Proto.
 */
export function sessionCookieOptions(request: Request) {
  const proto =
    request.headers.get("x-forwarded-proto") ??
    (new URL(request.url).protocol === "https:" ? "https" : "http");

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SEC,
    secure: proto === "https",
  };
}
