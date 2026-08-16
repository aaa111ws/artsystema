import { NextResponse, type NextRequest } from "next/server";

/**
 * Прокидывает путь в заголовке: по нему layout понимает, что открыта
 * админка, и не рисует вокруг неё шапку и футер сайта.
 *
 * Редиректа на форму входа здесь нет намеренно. За обратным прокси
 * приложение знает себя как localhost:8210, и абсолютный адрес из
 * middleware уводил браузер на этот внутренний порт. Проверку делает
 * сама страница через redirect() — он относительный и учитывает basePath.
 */
export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|catalog/|works/|clients/).*)"],
};
