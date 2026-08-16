import {
  Building2,
  Drill,
  PaintRoller,
  Repeat,
  Ruler,
  ShieldCheck,
  Sparkles,
  Truck,
  Wallet,
  Weight,
  Wrench,
} from "lucide-react";
import type { IconName } from "@/lib/content-types";

/** Данные хранят имя иконки строкой — здесь единственное место, где оно превращается в компонент. */
const ICONS = {
  Building2,
  Drill,
  PaintRoller,
  Repeat,
  Ruler,
  ShieldCheck,
  Sparkles,
  Truck,
  Wallet,
  Weight,
  Wrench,
} as const;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Cmp = ICONS[name];
  return <Cmp className={className} aria-hidden="true" />;
}
