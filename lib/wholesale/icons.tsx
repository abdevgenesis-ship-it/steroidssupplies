import type { LucideIcon } from "lucide-react";
import {
  BadgePercent,
  Boxes,
  FileText,
  Headphones,
  Package,
  Search,
  Send,
  ShieldCheck,
  Truck,
  Wallet,
  Zap,
} from "lucide-react";

import type { WholesaleIconKey } from "@/lib/wholesale/content";

export const WHOLESALE_ICON_MAP: Record<WholesaleIconKey, LucideIcon> = {
  badgePercent: BadgePercent,
  boxes: Boxes,
  fileText: FileText,
  headphones: Headphones,
  package: Package,
  search: Search,
  send: Send,
  shieldCheck: ShieldCheck,
  truck: Truck,
  wallet: Wallet,
  zap: Zap,
};
