/** Имя cookie сессии. Отдельный файл: middleware работает на edge-рантайме,
 *  куда нельзя тянуть node:crypto из lib/auth. */
export const SESSION_COOKIE = "artsystema_admin";
