"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { BlogCardData } from "@/components/blog/BlogCard";

type FeaturedBlogPostProps = {
  post: BlogCardData;
};

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return "Latest";
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  } catch {
    return "Latest";
  }
}

export function FeaturedBlogPost({ post }: FeaturedBlogPostProps) {
  return (
    <Card
      size="sm"
      className="group mb-8 overflow-hidden border-border/70 transition-all duration-300 hover:-translate-y-1 hover:border-highlight/35 sm:mb-10"
    >
      <CardContent className="grid gap-6 p-0 sm:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden sm:aspect-auto sm:h-80">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              No Image
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.28)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between p-6 sm:p-8">
          {/* Meta info */}
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-block rounded-full bg-highlight/10 px-3 py-1 font-medium uppercase tracking-[0.18em] text-highlight">
                Featured
              </span>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </div>
              {post.category && (
                <>
                  <span className="text-border">/</span>
                  <span className="rounded-full border border-border/70 bg-muted/50 px-2.5 py-0.5 font-medium text-foreground/75 backdrop-blur-sm">
                    {post.category}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h2 className="mt-4 font-heading text-2xl font-bold leading-tight sm:text-3xl">
              <Link href={post.href} className="transition-colors hover:text-highlight">
                {post.title}
              </Link>
            </h2>

            {/* Excerpt */}
            <p className="mt-3 line-clamp-3 text-base leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          </div>

          {/* CTA Button */}
          <div className="mt-6">
            <Button
              asChild
              className="inline-flex items-center gap-2 transition-all duration-300"
            >
              <Link href={post.href} className="inline-flex items-center gap-2">
                Read Full Article
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
