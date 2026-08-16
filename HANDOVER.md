# ART SYSTEMA — техническая документация

Сайт-каталог подвесных систем для картин: витрина, каталог с фильтрами и корзиной-заявкой, админка для правки всего контента без разработчика.

Пароли и доступы — в `ACCESS.md` (в этот файл они намеренно не попали).

- Прод: http://80.74.26.45/artsystema (подпапка на общем VPS)
- Админка: `/artsystema/admin`
- Локально: `/home/nnn64/artsystema`, dev-сервер на порту 3300

---

## Стек

| Что | Версия | Зачем |
|---|---|---|
| TypeScript | 5.7 | весь код, строгий режим |
| Next.js | 15 (App Router) | фреймворк, SSR, API-роуты, сборка `standalone` |
| React | 19 | UI |
| Tailwind CSS | 4 | стили, через `@tailwindcss/postcss` |
| framer-motion | 12 | анимация мобильного меню, модалок, тостов |
| lucide-react | 0.475 | иконки (кроме логотипа WhatsApp — он свой, `ui/whatsapp-icon.tsx`) |
| next-themes | 0.4 | светлая/тёмная тема |
| Node.js | 20+ | рантайм, на сервере запускается `node server.js` |

Внешних сервисов два: **Web3Forms** (отправка заявок) и всё. Ни базы данных, ни Docker, ни CMS — данные лежат в двух JSON-файлах.

Проект **не под git** — при первой возможности `git init`, иначе история изменений теряется.

---

## Структура

```
src/
  app/                    маршруты App Router
    page.tsx              главная (собрана из секций)
    catalog|services|works|delivery|contacts|about|privacy/page.tsx
    admin/page.tsx        панель управления
    admin/login/page.tsx  форма входа
    api/admin/login       вход, выдача cookie
    api/admin/content     сохранение site.json и catalog.json
    api/admin/upload      загрузка фото товаров
    api/lead              приём заявки (запасной путь, см. «Заявки»)
    layout.tsx            читает контент на сервере и отдаёт в провайдер
    globals.css           токены темы + утилиты (.container-x, .section-y)
    robots.ts, sitemap.ts генерируются из SITE_URL
  components/
    layout/               шапка, футер, плавающие кнопки, логотип, page-hero
    sections/             блоки страниц: hero, about, services, catalog, works, faq…
    ui/                   кнопки, модалки, корзина, карточка товара, формы
    admin/                панель, рекурсивный редактор полей, редактор каталога
  lib/
    content-types.ts      типы контента + productImage, formatPrice, SITE_URL
    content-server.ts     чтение/запись JSON на сервере (атомарно, через temp-файл)
    content.tsx           провайдер и хуки useSiteContent(), useCatalog(), useSite()
    auth.ts               проверка пароля, подпись и проверка сессионной cookie
    session-cookie.ts     имя cookie отдельным модулем (middleware — edge-рантайм)
    cart.tsx              корзина в контексте + localStorage
    lead-modal.tsx        глобальная модалка заявки
    utils.ts              cn(), telHref(), asset()
  middleware.ts           прокидывает x-pathname, чтобы layout знал про /admin
content/
  site.json               весь текст сайта
  catalog.json            категории и товары
public/
  catalog/                фото товаров (на сервере — симлинк на данные)
  works/, clients/        фото работ и логотипы клиентов
```

---

## Главное архитектурное решение: контент в JSON

Весь текст сайта вынесен из кода в `content/site.json` и `content/catalog.json`. Без этого админка не смогла бы править контент: правка кода требует пересборки, правка JSON — нет.

Как это работает:

1. `layout.tsx` на сервере читает оба файла через `content-server.ts`;
2. отдаёт их в клиентский провайдер `content.tsx`;
3. секции берут данные хуками: `const { hero, site } = useSiteContent()`.

`site.json` — объект с ключами `site, hero, clients, nav, about, stats, advantages, services, delivery, works, faq`. `catalog.json` — `{ categories, products }`, товар это `{ id, name, description, load, category, variants[] }`, у варианта своя цена. Картинка товара по умолчанию ищется по id: `/catalog/<id>.webp` (см. `productImage`).

**Админка строится по структуре JSON автоматически.** `components/admin/field-editor.tsx` — рекурсивный редактор: он обходит объект и рисует поле под каждый тип значения. Поэтому новое поле в JSON появляется в панели само, без правки админки. Подписи полей — в словаре в начале того же файла.

Записывает изменения `content-server.ts` — сначала во временный файл, потом переименованием, чтобы при сбое не остался обрубок.

---

## Админка и авторизация

Один пароль на вход, `ADMIN_PASSWORD` из окружения. После входа выдаётся cookie `artsystema_admin` с меткой времени и HMAC-подписью — самого пароля в ней нет. Секрет подписи — `ADMIN_SECRET` (если не задан, подписывается паролем). Сессия живёт 12 часов, сравнение через `timingSafeEqual`, после неверного пароля — пауза 700 мс.

Проверку доступа делает сама страница `/admin` через `redirect()` из `next/navigation`. В middleware редиректа нет намеренно — см. «Грабли».

---

## Каталог, корзина, заявки

Корзина — контекст `lib/cart.tsx` плюс `localStorage`, серверной части нет. Из корзины уходит заявка со списком позиций.

**Заявки отправляются из браузера в Web3Forms**, ключ `NEXT_PUBLIC_WEB3FORMS_KEY` вшит в сборку. Серверный роут `api/lead` существует, но на бесплатном плане Web3Forms отклоняет серверные запросы (403 «Use our API in client side»), поэтому рабочий путь — клиентский. SMTP не используется: Mail.ru и Gmail требуют пароль приложения.

---

## Локальный запуск

```bash
cd /home/nnn64/artsystema
npm install          # см. «Грабли»: в WSL нужен обход прокси
npm run dev          # http://localhost:3300, админка /admin
npm run typecheck    # tsc --noEmit
```

`.env.local`:

```
NEXT_PUBLIC_WEB3FORMS_KEY=...
ADMIN_PASSWORD=...
ADMIN_SECRET=...
```

---

## Сборка и выкладка

Сайт живёт в подпапке, поэтому путь задаётся на этапе сборки — он вшивается в HTML и статику.

```bash
# 1. собрать (dev-сервер должен быть остановлен)
rm -rf .next
NEXT_PUBLIC_BASE_PATH=/artsystema NEXT_PUBLIC_SITE_URL=https://my.100nb.ru npx next build

# 2. доложить в standalone то, что Next туда не кладёт
cp -r .next/static .next/standalone/.next/
cp -r public content .next/standalone/
rm -rf .next/standalone/public/catalog     # иначе затрёт симлинк на фото

# 3. упаковать
tar czf build.tar.gz -C .next/standalone .
```

Дальше на сервере (скриптом на paramiko, sshpass нет):

```bash
tar xzf /root/artsystema-new.tar.gz -C /opt/artsystema.new
ln -sfn /var/www/artsystema-data/uploads /opt/artsystema.new/public/catalog
systemctl stop artsystema
rm -rf /opt/artsystema.old
mv /opt/artsystema /opt/artsystema.old
mv /opt/artsystema.new /opt/artsystema
systemctl start artsystema
```

Проверка: `systemctl is-active artsystema` и `curl -o /dev/null -w '%{http_code}' http://127.0.0.1:8210/artsystema`.

---

## Как устроено на сервере

| Что | Где |
|---|---|
| Код | `/opt/artsystema` (внутри `server.js` из standalone-сборки) |
| Данные админки | `/var/www/artsystema-data/content` — `site.json`, `catalog.json` |
| Загруженные фото | `/var/www/artsystema-data/uploads`, симлинк `/opt/artsystema/public/catalog` |
| Сервис | `/etc/systemd/system/artsystema.service`, порт 8210, `Restart=always` |
| Nginx | общий конфиг `sites-enabled/nbuchot`, `location /artsystema` → `127.0.0.1:8210` |
| Бэкапы | `/opt/artsystema.old`, `/opt/artsystema.prev`, `/opt/artsystema.backup-*` |

Переменные окружения прода заданы в юните: `PORT`, `HOSTNAME`, `CONTENT_DIR`, `UPLOAD_DIR`, `ADMIN_PASSWORD`, `ADMIN_SECRET`.

**Данные вынесены за пределы папки сборки специально** — иначе выкладка новой версии стирает всё, что заказчик наредактировал.

---

## Грабли

**`fetch("/api/...")` в клиентских компонентах не получает basePath.** Он применяется только к `<Link>`, `redirect()` и статике. На сервере в подпапке запрос уходит в корень домена, nginx отвечает 301 на чужой сайт — внешне это выглядело как «пароль от админки не подходит». Все вызовы обёрнуты в `asset()`. Перед выкладкой проверять: `grep -rn 'fetch("/api' src` — должно быть пусто.

**`cn()` — это простая склейка строк, не `tailwind-merge`.** Передать компоненту `className="hidden md:inline-flex"` не значит спрятать его: внутри компонента базовый `inline-flex` в CSS идёт позже `hidden` и побеждает. Адаптивный display вешать на обёртку, а не передавать внутрь. Из-за этого на телефоне из шапки уезжала кнопка меню.

**`NextResponse.redirect()` в middleware уводил на `localhost:8210`** — за прокси приложение так себя видит. Редирект из middleware убран, проверка делается на странице относительным `redirect()`.

**Cookie не сохранялась по http://** — флаг `secure` ставился по `NODE_ENV`, браузер такую cookie молча выбрасывал. Теперь `sessionCookieOptions()` смотрит на `x-forwarded-proto`.

**`next build` при запущенном `npm run dev` затирает `.next`** — сайт открывается голым HTML без стилей. Лечится `rm -rf .next` и пересборкой.

**middleware не тянет `node:crypto`** (edge-рантайм) — имя cookie вынесено в отдельный модуль `session-cookie.ts`.

**npm в WSL висит из-за мёртвых системных прокси.** Ставить так:
`NPM_CONFIG_USERCONFIG=/dev/null env -u HTTPS_PROXY -u HTTP_PROXY npm install`.

**Мобильную вёрстку из WSL headless-Chrome напрямую не проверить** — Windows не даёт окну ширину меньше ~504 CSS-px, получается обрезка, похожая на сломанный сайт. Проверять через временный `public/__probe.html` с `<iframe style="width:390px">`, снимать его при окне 700px.

---

## Что не доделано

- **Заявки уходят на нашу почту**, а не на почту заказчика — нужен ключ Web3Forms на `art-spekt@yandex.ru` и пересборка.
- **Нет домена и HTTPS.** Сайт по голому IP, пароль админки ходит открытым текстом. `sitemap.xml` и `robots.txt` ссылаются на `my.100nb.ru`, который смотрит на чужой сервер.
- **Нет аналитики** — ни Метрики, ни GA.
- **Нет git-репозитория.**
- Админка на одном пароле, без ролей и истории правок.
