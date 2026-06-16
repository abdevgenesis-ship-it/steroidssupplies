"use client";

import { useMemo, useState } from "react";
import { FileText, ListChecks, MessageSquareText, Truck } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type { ProductShippingInfo, ProductSpecs, ProductVariant } from "@/types/sanity";

type ProductInfoTabsProps = {
  productName: string;
  descriptionBlocks?: unknown[];
  variants?: ProductVariant[];
  specs?: ProductSpecs;
  shippingInfo?: ProductShippingInfo;
};

type TabKey = "description" | "specifications" | "shipping" | "reviews";

const TABS: Array<{ key: TabKey; label: string; icon: React.ComponentType<{ className?: string }>; helper: string }> = [
  { key: "description", label: "Description", icon: FileText, helper: "Product overview" },
  { key: "specifications", label: "Specifications", icon: ListChecks, helper: "Technical details" },
  { key: "shipping", label: "Shipping Info", icon: Truck, helper: "Delivery & compliance" },
  { key: "reviews", label: "Reviews", icon: MessageSquareText, helper: "Customer feedback" },
];

export function ProductInfoTabs({ productName, descriptionBlocks, variants = [], specs, shippingInfo }: ProductInfoTabsProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<TabKey>("description");
  const activeTabLabel = TABS.find((tab) => tab.key === activeTab)?.label ?? "Description";

  const descriptionLines = useMemo(() => {
    if (!Array.isArray(descriptionBlocks)) {
      return [] as string[];
    }

    const lines: string[] = [];
    for (const block of descriptionBlocks as Array<{ _type?: string; children?: Array<{ text?: string }> }>) {
      if (block?._type !== "block" || !Array.isArray(block.children)) {
        continue;
      }

      const text = block.children
        .map((child) => child?.text ?? "")
        .join("")
        .trim();

      if (text.length > 0) {
        lines.push(text);
      }
    }

    return lines;
  }, [descriptionBlocks]);

  const specRows = useMemo(() => {
    const rows: Array<{ label: string; value: string }> = [];

    // Variant-based specs
    rows.push({ label: "Variant Count", value: String(variants.length) });

    const flavors = Array.from(
      new Set(variants.map((variant) => variant.flavor?.trim()).filter((value): value is string => Boolean(value))),
    );
    if (flavors.length > 0) {
      rows.push({ label: "Flavors", value: flavors.join(", ") });
    }

    const packSizes = Array.from(
      new Set(variants.map((variant) => variant.packSize?.trim()).filter((value): value is string => Boolean(value))),
    );
    if (packSizes.length > 0) {
      rows.push({ label: "Pack Sizes", value: packSizes.join(", ") });
    }

    const puffCounts = variants
      .map((variant) => variant.puffCount)
      .filter((count): count is number => typeof count === "number" && Number.isFinite(count));
    if (puffCounts.length > 0) {
      const min = Math.min(...puffCounts);
      const max = Math.max(...puffCounts);
      rows.push({
        label: "Puff Count",
        value: min === max ? `${min.toLocaleString()} puffs` : `${min.toLocaleString()}-${max.toLocaleString()} puffs`,
      });
    }

    const thcStrengths = Array.from(
      new Set(
        variants
          .map((variant) => variant.nicotinePercent)
          .filter((value): value is number => typeof value === "number" && Number.isFinite(value)),
      ),
    );
    if (thcStrengths.length > 0) {
      rows.push({
        label: "THC Potency",
        value: thcStrengths.map((value) => `${value}mg`).join(", "),
      });
    }

    const skuCount = variants.filter((variant) => typeof variant.sku === "string" && variant.sku.trim().length > 0).length;
    if (skuCount > 0) {
      rows.push({ label: "SKU Count", value: String(skuCount) });
    }

    // Product specs from CMS
    if (specs) {
      if (specs.battery?.trim()) {
        rows.push({ label: "Battery", value: specs.battery });
      }
      if (specs.batteryLife?.trim()) {
        rows.push({ label: "Battery Life", value: specs.batteryLife });
      }
      if (specs.chargingType?.trim()) {
        rows.push({ label: "Charging Type", value: specs.chargingType });
      }
      if (specs.chargingTime?.trim()) {
        rows.push({ label: "Charging Time", value: specs.chargingTime });
      }
      if (specs.fillVolume?.trim()) {
        rows.push({ label: "Fill Volume", value: specs.fillVolume });
      }
      if (specs.dimensions?.trim()) {
        rows.push({ label: "Dimensions", value: specs.dimensions });
      }
      if (specs.weight?.trim()) {
        rows.push({ label: "Weight", value: specs.weight });
      }
      if (specs.material?.trim()) {
        rows.push({ label: "Material", value: specs.material });
      }
      if (specs.warranty?.trim()) {
        rows.push({ label: "Warranty", value: specs.warranty });
      }
      if (specs.certifications?.trim()) {
        rows.push({ label: "Certifications", value: specs.certifications });
      }
    }

    return rows;
  }, [variants, specs]);

  return (
    <section
      aria-label="Product information tabs"
      className="glass-listing mt-8 rounded-3xl p-5 sm:p-6 lg:mt-10 lg:p-8"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-highlight">Product Information</p>
          <h2 className="font-heading text-xl text-foreground sm:text-2xl">Everything You Need to Know</h2>
        </div>
        <p className="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Viewing: {activeTabLabel}
        </p>
      </div>

      <div role="tablist" aria-label="Product content" className="mb-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            id={`tab-${tab.key}`}
            aria-controls={`panel-${tab.key}`}
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-2xl border px-3 py-2.5 text-left transition ${
              activeTab === tab.key
                ? "border-highlight bg-highlight/12 text-foreground"
                : "border-border bg-background text-muted-foreground hover:border-highlight/30 hover:text-foreground"
            }`}
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest">
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </span>
            <span className="mt-1 block text-[11px] uppercase tracking-widest text-muted-foreground/90">
              {tab.helper}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {activeTab === "description" ? (
          <motion.div
            key="description"
            role="tabpanel"
            id="panel-description"
            aria-labelledby="tab-description"
            className="space-y-3 rounded-2xl border border-border bg-background p-4"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
            transition={prefersReducedMotion ? undefined : { duration: 0.25 }}
          >
            {descriptionLines.length > 0 ? (
              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {descriptionLines.map((line, index) => (
                  <p key={`${line}-${index}`}>{line}</p>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">Description not provided.</p>
            )}
          </motion.div>
        ) : null}

        {activeTab === "specifications" ? (
          <motion.div
            key="specifications"
            role="tabpanel"
            id="panel-specifications"
            aria-labelledby="tab-specifications"
            className="rounded-2xl border border-border bg-background p-4"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
            transition={prefersReducedMotion ? undefined : { duration: 0.25 }}
          >
            {specRows.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Spec</th>
                      <th className="px-4 py-3 font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specRows.map((row, index) => (
                      <tr key={row.label} className={`border-t border-border ${index % 2 === 1 ? "bg-muted/20" : ""}`}>
                        <td className="px-4 py-3 font-medium text-foreground">{row.label}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-2 rounded-2xl border border-border bg-muted/30 p-4 text-center">
                <p className="text-sm font-medium text-foreground">Specifications Not Available</p>
                <p className="text-xs text-muted-foreground">Detailed specifications are not yet available. Please contact support for more information.</p>
              </div>
            )}
          </motion.div>
        ) : null}

        {activeTab === "shipping" ? (
          <motion.div
            key="shipping"
            role="tabpanel"
            id="panel-shipping"
            aria-labelledby="tab-shipping"
            className="rounded-2xl border border-border bg-background p-4"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
            transition={prefersReducedMotion ? undefined : { duration: 0.25 }}
          >
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
                  <tr>
                      <th className="px-4 py-3 font-semibold">Shipping Detail</th>
                    <th className="px-4 py-3 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-foreground">Timeline</td>
                    <td className="px-4 py-3 text-muted-foreground">{shippingInfo?.timeline?.trim() || "Not provided"}</td>
                  </tr>
                  <tr className="border-t border-border bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">Import Compliance</td>
                    <td className="px-4 py-3 text-muted-foreground">{shippingInfo?.pactCompliance?.trim() || "Not provided"}</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-foreground">Regions Covered</td>
                    <td className="px-4 py-3 text-muted-foreground">{shippingInfo?.statesCovered?.trim() || "Not provided"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : null}

        {activeTab === "reviews" ? (
          <motion.div
            key="reviews"
            role="tabpanel"
            id="panel-reviews"
            aria-labelledby="tab-reviews"
            className="space-y-3 rounded-2xl border border-border bg-background p-4"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
            transition={prefersReducedMotion ? undefined : { duration: 0.25 }}
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Recent partner feedback for {productName}</p>
            <div className="rounded-xl border border-border p-3">
              <p className="text-sm font-medium text-foreground">Fast shipping and consistent quality for repeat store orders.</p>
              <p className="mt-1 text-xs text-muted-foreground">Retail Partner • Texas</p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-sm font-medium text-foreground">Strong wholesale margins and reliable inventory availability.</p>
              <p className="mt-1 text-xs text-muted-foreground">Wholesale Buyer • Florida</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
