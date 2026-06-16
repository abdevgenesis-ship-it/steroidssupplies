import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type SupportingLink = {
  title: string;
  href: string;
};

type CategorySupportingLinksProps = {
  links: SupportingLink[];
  heading: string;
  description: string;
  emptyMessage: string;
};

export function CategorySupportingLinks({
  links,
  heading,
  description,
  emptyMessage,
}: CategorySupportingLinksProps) {

  return (
    <section aria-label="Related supporting guides" className="glass-listing mt-10 rounded-2xl p-5 sm:p-6">
      <h2 className="font-heading text-2xl leading-tight sm:text-3xl">{heading}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      {links.length > 0 ? (
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-xl border border-border/60 bg-muted/30 p-3 text-sm font-medium backdrop-blur-sm transition hover:border-primary/35 hover:bg-muted/50"
            >
              <span className="inline-flex items-start gap-2">
                <span>{link.title}</span>
                <ArrowUpRight
                  className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                  aria-hidden="true"
                />
              </span>
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
