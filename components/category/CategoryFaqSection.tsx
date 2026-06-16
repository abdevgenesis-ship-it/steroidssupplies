import Link from "next/link";

import { renderTextWithBold } from "@/lib/content/renderTextWithBold";

type CategoryFaqItem = {
  id: string;
  question: string;
  answer: string;
  ctaLabel?: string;
  ctaHref?: string;
};

type CategoryFaqSectionProps = {
  heading: string;
  description?: string;
  emptyMessage: string;
  items: CategoryFaqItem[];
};

export function CategoryFaqSection({
  heading,
  description,
  emptyMessage,
  items,
}: CategoryFaqSectionProps) {
  return (
    <section aria-label="Category FAQ" className="glass-listing mt-10 rounded-2xl p-5 sm:p-6">
      <h2 className="font-heading text-2xl leading-tight sm:text-3xl">{heading}</h2>
      {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}

      {items.length > 0 ? (
        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <h3 className="text-base font-semibold text-foreground">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{renderTextWithBold(item.answer)}</p>
              {item.ctaLabel && item.ctaHref ? (
                <Link
                  href={item.ctaHref}
                  className="mt-3 inline-flex text-sm font-medium text-highlight hover:underline"
                >
                  {item.ctaLabel}
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="glass-field mt-5 rounded-xl p-3 text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}
