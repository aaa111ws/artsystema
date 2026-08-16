import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Services } from "@/components/sections/services";
import { Advantages } from "@/components/sections/advantages";

export const metadata: Metadata = {
  title: "Наши услуги",
  description:
    "Бесплатный подбор подвесной системы, выезд специалиста в течение 24 часов, доставка в любой регион России, установка любой сложности, гарантия 12 месяцев.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Наши услуги и сервис"
        subtitle="Оставьте заявку и мы подберем оптимальную подвесную систему в течении 10 минут."
      />
      <Services />
      <Advantages />
    </>
  );
}
