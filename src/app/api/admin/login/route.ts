import { NextResponse } from "next/server";
import { SESSION_COOKIE, createToken, isPasswordValid, sessionCookieOptions } from "@/lib/auth";

/** Пауза после неверного пароля — простейшая защита от перебора. */
const wrongPasswordDelay = () => new Promise((r) => setTimeout(r, 700));

export async function POST(request: Request) {
  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password ?? "";
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "Пароль админки не задан в .env.local (ADMIN_PASSWORD)" },
      { status: 500 },
    );
  }

  if (!password || !isPasswordValid(password)) {
    await wrongPasswordDelay();
    return NextResponse.json({ ok: false, error: "Неверный пароль" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createToken(), sessionCookieOptions(request));
  return res;
}

export async function DELETE(request: Request) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(request), maxAge: 0 });
  return res;
}
