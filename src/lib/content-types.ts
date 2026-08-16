/**
 * Типы редактируемого контента. Сами данные лежат в content/site.json
 * и content/catalog.json — их правит админка, код их только читает.
 */

export type IconName =
  | "Building2"
  | "Drill"
  | "PaintRoller"
  | "Repeat"
  | "Ruler"
  | "ShieldCheck"
  | "Sparkles"
  | "Truck"
  | "Wallet"
  | "Weight"
  | "Wrench";

export type SiteInfo = {
  name: string;
  tagline: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  email: string;
  emailHref: string;
  schedule: string;
  city: string;
  years: number;
};

export type NavItem = { href: string; label: string };

export type Hero = {
  topbar: string;
  title: string;
  points: string[];
  formTitle: string;
  formText: string;
  formButton: string;
};

export type Client = { src: string; name: string };

export type About = { title: string; lead: string; paragraphs: string[] };

export type Stat = { value: string; label: string };

export type Feature = { icon: IconName; title: string; text: string };

export type Service = Feature & { note: string };

export type DeliveryBlock = { title: string; items: string[] };

export type Delivery = {
  moscow: DeliveryBlock;
  russia: DeliveryBlock;
  payment: string[];
};

export type Work = { src: string; title: string; place: string; meta: string };

export type FaqItem = { q: string; a: string };

export type SiteContent = {
  site: SiteInfo;
  hero: Hero;
  clients: Client[];
  nav: NavItem[];
  about: About;
  stats: Stat[];
  advantages: Feature[];
  services: Service[];
  delivery: Delivery;
  works: Work[];
  faq: FaqItem[];
};

export type CategoryId = string;

export type Category = {
  id: CategoryId;
  title: string;
  short: string;
  description: string;
};

export type Variant = {
  /** Что отличает вариант: длина, цвет, исполнение. */
  label: string;
  price: number;
};

export type Product = {
  id: string;
  name: string;
  /** Описание из прайса. Есть не у всех позиций. */
  description?: string;
  /** Нагрузка — только если она заявлена в прайсе. */
  load?: string;
  category: CategoryId;
  variants: Variant[];
  /** Своё фото. По умолчанию /catalog/<id>.webp. */
  image?: string;
};

export type CatalogContent = {
  categories: Category[];
  products: Product[];
};

export type Content = { site: SiteContent; catalog: CatalogContent };

export const minPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price));

/** Путь к фото товара: либо заданный вручную, либо по id. */
export const productImage = (p: Product) => p.image ?? `/catalog/${p.id}.webp`;

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("ru-RU").format(value) + " ₽";

/** Адрес сайта для карты и robots — задаётся окружением, а не админкой. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://artsystema.ru").replace(
  /\/$/,
  "",
);
