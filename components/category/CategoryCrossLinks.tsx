import Link from "next/link";

type CrossLink = {
  title: string;
  href: string;
};

type CategoryCrossLinksProps = {
  links: CrossLink[];
  heading: string;
  description: string;
  emptyMessage: string;
};

export function CategoryCrossLinks({
  links,
  heading,
  description,
  emptyMessage,
}: CategoryCrossLinksProps) {
  return (
    <section aria-label="Cross-category links" className="glass-listing mt-10 rounded-2xl p-5 sm:p-6">
      <h2 className="font-heading text-2xl leading-tight sm:text-3xl">{heading}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      {links.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2.5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-border/70 bg-muted/50 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.11em] text-foreground backdrop-blur-sm transition hover:border-primary/40 hover:text-primary"
            >
              {link.title}
            </Link>
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
