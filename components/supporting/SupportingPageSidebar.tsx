import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { SupportingPage } from "@/types/sanity";

type SupportingPageSidebarProps = {
  page: SupportingPage;
  parentHref: string;
  siblingBasePath: string;
};

export function SupportingPageSidebar({ page, parentHref, siblingBasePath }: SupportingPageSidebarProps) {
  const getSiblingHref = (slug?: string, fallbackId?: string) => {
    const segment = slug || fallbackId || "";
    if (!segment) return siblingBasePath || parentHref || "/";

    const normalizedParent = (siblingBasePath || parentHref || "").replace(/\/+$/, "");
    return `${normalizedParent}/${segment}`.replace(/\/+/g, "/");
  };

  return (
    <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
      <Card className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_16px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-border hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-highlight/80">Sibling links</p>
        <div className="mt-4 space-y-2.5 sm:space-y-3">
          {page.siblingLinks?.length ? (
            page.siblingLinks.map((link) => (
              <Link
                key={link._id}
                href={getSiblingHref(link.slug?.current, link._id)}
                className="group flex items-center justify-between rounded-2xl border border-border/90 bg-background px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-highlight/40 hover:bg-highlight/10 hover:shadow-md sm:py-3"
              >
                <span className="line-clamp-2 transition-colors duration-300 group-hover:text-highlight">{link.title || "Sibling page"}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-highlight" aria-hidden="true" />
              </Link>
            ))
          ) : (
            <p className="text-xs text-muted-foreground sm:text-sm">No sibling links configured yet.</p>
          )}
        </div>
      </Card>

      <Card className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_16px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-border hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-highlight/80">Related products</p>
        <div className="mt-4 space-y-2.5 sm:space-y-3">
          {page.relatedProducts?.length ? (
            page.relatedProducts.slice(0, 3).map((product) => (
              <Link
                key={product._id}
                href={product.slug?.current ? `/product/${product.slug.current}` : "/products"}
                className="group block rounded-2xl border border-border/90 bg-background px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-highlight/40 hover:bg-highlight/10 hover:shadow-md sm:py-3"
              >
                <span className="line-clamp-2 transition-colors duration-300 group-hover:text-highlight">{product.name || "Related product"}</span>
              </Link>
            ))
          ) : (
            <p className="text-xs text-muted-foreground sm:text-sm">No related products configured yet.</p>
          )}
        </div>
      </Card>
    </aside>
  );
}