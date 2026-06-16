"use client";

import Link from "next/link";

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

type TableOfContentsProps = {
  items: TocItem[];
};

export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        On This Page
      </p>
      <nav className="mt-4">
        <ul className="space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.id} className={item.level === 3 ? "pl-4" : ""}>
              <Link
                href={`#${item.id}`}
                className={
                  item.level === 2
                    ? "font-medium text-foreground transition-colors hover:text-highlight"
                    : "text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
