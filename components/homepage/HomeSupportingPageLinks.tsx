"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"

type LinkItem = {
  title: string
  href: string
}

type Props = {
  links: LinkItem[]
  initialCount?: number
}

export function HomeSupportingPageLinks({ links, initialCount = 15 }: Props) {
  const [expanded, setExpanded] = useState(false)

  const visible = expanded ? links : links.slice(0, initialCount)
  const hasMore = links.length > initialCount

  return (
    <section className="border-t border-border/50 bg-muted/30 text-foreground">
      <Container className="section-y">
        <div className="mb-6 text-center">
          <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-highlight sm:text-[11px] sm:tracking-[0.18em]">
            <span className="h-px w-8 bg-highlight/70" />
            Explore
            <span className="h-px w-8 bg-highlight/70" />
          </p>
          <h2 className="mt-2 font-heading text-2xl leading-tight sm:text-3xl">
            Browse All Pages
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Find guides, compliance information, and more across the site.
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {visible.map(({ title, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="block truncate text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>

        {hasMore && (
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded((v) => !v)}
              className="gap-1.5"
            >
              {expanded ? (
                <>
                  Show less <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Read more ({links.length - initialCount} more){" "}
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </Container>
    </section>
  )
}
