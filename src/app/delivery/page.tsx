import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Delivery } from "@/components/sections/delivery";

export const metadata: Metadata = {
  title: "Доставка и оплата",
  description:
    "Доставка по Москве и области и во все регионы России транспортными компаниями. Наличный и безналичный расчет, частичная оплата, перевод на карту.",
};

export default function DeliveryPage() {
  return (
    <>
      <PageHero
        title="Доставка и оплата"
        subtitle="Мы работаем не только по Москве и Московской области — доставляем подвесные системы и комплектующие во все регионы России."
      />
      <Delivery />
    </>
  );
}
