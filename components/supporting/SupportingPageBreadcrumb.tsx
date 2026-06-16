import Link from "next/link";

type SupportingPageBreadcrumbProps = {
  parentHref: string;
  parentLabel: string;
  pageTitle: string;
};

export function SupportingPageBreadcrumb({ parentHref, parentLabel, pageTitle }: SupportingPageBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-widest text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <li>
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li>
          <Link href={parentHref} className="hover:text-foreground">
            {parentLabel}
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li className="text-foreground">{pageTitle}</li>
      </ol>
    </nav>
  );
}