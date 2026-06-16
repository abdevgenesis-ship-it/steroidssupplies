import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SupportingPageProductsGrid } from "@/components/supporting/SupportingPageProductsGrid";
import { categoryPublicPath } from "@/config/seo";
import { mapSanityProductToShopCard } from "@/lib/mapSanityProductToShopCard";
import { urlFor } from "@/lib/sanity";
import type { SupportingPage } from "@/types/sanity";
import { blocksToContentBlocks, blocksToParagraphs } from "./supportingPageUtils";

type SupportingPageBodyProps = {
  page: SupportingPage;
};

function renderDeepContentBlock(block: { style: string; text: string }, pageId: string, index: number) {
  if (block.style === "h2") {
    return (
      <h2 key={`${pageId}-deep-${index}`} className="font-heading text-2xl sm:text-3xl">
        {block.text}
      </h2>
    );
  }

  if (block.style === "h3") {
    return (
      <h3 key={`${pageId}-deep-${index}`} className="font-heading text-xl sm:text-2xl">
        {block.text}
      </h3>
    );
  }

  return (
    <p key={`${pageId}-deep-${index}`} className="text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
      {block.text}
    </p>
  );
}

export function SupportingPageBody({ page }: SupportingPageBodyProps) {
  const deepBlocks = blocksToContentBlocks(page.aboveFoldDeepContent);
  const legacyDeepBlocks =
    deepBlocks.length > 0
      ? deepBlocks
      : [
          ...(page.h2Heading ? [{ style: "h2", text: page.h2Heading }] : []),
          ...blocksToParagraphs(page.h2Paragraphs).map((text) => ({ style: "normal", text })),
        ];

  const legacyBodyParagraphs = blocksToParagraphs(page.body);
  const whyChooseUsPoints =
    page.whyChooseUsPoints
      ?.map((point) => (typeof point === "string" ? point.trim() : ""))
      .filter((point): point is string => Boolean(point)) ?? [
      "We maintain category-focused wholesale inventory designed for gym networks and B2B buyers.",
      "Our team helps with fast quote support, practical reorder guidance, and product-mix planning.",
      "We keep compliance-aware shipping workflows so your wholesale operations stay predictable.",
    ];

  const pageFaqs = page.pageFaqs?.filter((faq) => faq.question?.trim() && faq.answer?.trim()) ?? [];

  const resolvedProducts = (page.relatedProducts ?? []).filter(
    (product): product is NonNullable<typeof product> => Boolean(product?._id),
  );

  const productCategories = (page.categories || [])
    .filter((category): category is NonNullable<typeof category> => Boolean(category?._id))
    .map((category) => {
      const slug = category.slug?.current;
      if (!slug) return null;

      return {
        _id: category._id,
        name: category.name?.trim() || "Category",
        slug,
        shortDescription:
          category.shortDescription?.trim() || "Explore this wholesale product category and related inventory.",
        imageUrl: category.image?.asset
          ? urlFor(category.image).width(1200).height(800).fit("crop").url()
          : "/images/supporting-page-hero.png",
      };
    })
    .filter((category): category is NonNullable<typeof category> => Boolean(category))
    .slice(0, 4);

  return (
    <article className="space-y-6 sm:space-y-8">
      {legacyDeepBlocks.length > 0 ? (
        <section className="rounded-[2rem] border border-border bg-gradient-to-br from-card to-card/70 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-border hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] sm:p-8">
          <div className="space-y-3">
            {legacyDeepBlocks.map((block, index) => renderDeepContentBlock(block, page._id, index))}
          </div>
        </section>
      ) : null}

      <section className="rounded-[2rem] border border-border bg-gradient-to-br from-card to-card/70 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-border hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] sm:p-8">
        <h2 className="font-heading text-2xl sm:text-3xl">Products</h2>
        {resolvedProducts.length > 0 ? (
          <SupportingPageProductsGrid
            products={resolvedProducts.slice(0, 4).map(mapSanityProductToShopCard)}
          />
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Related products will appear here once they are assigned in Sanity.
          </p>
        )}
      </section>

      <section className="rounded-[2rem] border border-border bg-gradient-to-br from-card to-card/70 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-border hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] sm:p-8">
        <h2 className="font-heading text-2xl sm:text-3xl">{page.whyChooseUsHeading || "Why choose us"}</h2>
        <ul className="mt-5 grid gap-4 text-muted-foreground md:grid-cols-2 xl:grid-cols-3">
          {whyChooseUsPoints.map((point, index) => (
            <li
              key={`${page._id}-why-${index}`}
              className="group relative overflow-hidden rounded-2xl border border-border/90 bg-background/85 px-4 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-highlight/40 hover:bg-background hover:shadow-lg hover:shadow-highlight/10"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-highlight/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-highlight" aria-hidden="true" />
                <p className="leading-relaxed">{point}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[2rem] border border-border bg-gradient-to-br from-card to-card/70 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-border hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] sm:p-8">
        <h2 className="font-heading text-2xl sm:text-3xl">
          {page.categoriesHeading || page.otherCategoriesHeading || "Categories"}
        </h2>
        {productCategories.length ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {productCategories.map((category) => {
              const href = categoryPublicPath(category.slug);
              return (
                <Link
                  key={category._id}
                  href={href}
                  className="group overflow-hidden rounded-2xl border border-border/90 bg-card/95 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-highlight/45 hover:shadow-xl hover:shadow-highlight/10"
                >
                  <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted/20 ring-1 ring-inset ring-border/50">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <p className="absolute left-2 top-2 rounded-full border border-border bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                      Category
                    </p>
                  </div>
                  <div className="pt-3">
                    <p className="line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors duration-300 group-hover:text-highlight">
                      {category.name}
                    </p>
                    <p className="mt-2 min-h-10 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {category.shortDescription}
                    </p>
                    <div className="mt-3">
                      <span className="inline-flex w-full items-center justify-center rounded-lg border border-highlight/45 bg-highlight/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.11em] text-highlight transition-colors duration-300 group-hover:bg-highlight group-hover:text-background">
                        Browse Category
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Categories will appear here once category references are assigned in Sanity.
          </p>
        )}
      </section>

      {legacyBodyParagraphs.length > 0 ? (
        <section className="rounded-[2rem] border border-border bg-gradient-to-br from-card to-card/70 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-border hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] sm:p-8">
          <h2 className="font-heading text-2xl sm:text-3xl">Additional details</h2>
          <div className="mt-3 space-y-3 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {legacyBodyParagraphs.map((paragraph, index) => (
              <p key={`${page._id}-body-${index}`}>{paragraph}</p>
            ))}
          </div>
        </section>
      ) : null}

      {pageFaqs.length > 0 ? (
        <section className="rounded-[2rem] border border-border bg-gradient-to-br from-card to-card/70 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-border hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] sm:p-8">
          <h2 className="font-heading text-2xl sm:text-3xl">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-4 w-full">
            {pageFaqs.map((faq, index) => (
              <AccordionItem key={`${page._id}-faq-${index}`} value={`faq-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ) : null}
    </article>
  );
}
