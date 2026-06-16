type TrustTestimonial = {
  quote: string;
  source: string;
};

type CategoryTrustWallProps = {
  heading: string;
  testimonials: TrustTestimonial[];
  shields: string[];
};

export function CategoryTrustWall({ heading, testimonials, shields }: CategoryTrustWallProps) {
  const hasTestimonials = testimonials.length > 0;
  const hasShields = shields.length > 0;

  if (!hasTestimonials && !hasShields) {
    return null;
  }

  return (
    <section aria-label="Trust wall" className="glass-listing mt-10 rounded-2xl p-5 sm:p-6">
      <h2 className="font-heading text-2xl leading-tight sm:text-3xl">{heading}</h2>

      {hasTestimonials ? (
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <blockquote
              key={`${item.source}-${index}`}
              className="rounded-xl border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground"
            >
              <p className="text-foreground/90">{item.quote}</p>
              <footer className="mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-highlight/80">
                {item.source}
              </footer>
            </blockquote>
          ))}
        </div>
      ) : null}

      {hasShields ? (
        <ul className="mt-5 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
          {shields.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
