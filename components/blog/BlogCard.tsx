"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type BlogCardData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image?: string;
  imageAlt: string;
  publishedAt: string;
  category?: string;
  href: string;
};

type BlogCardProps = {
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

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card
      size="sm"
      className="group overflow-hidden border-border/70 transition-all duration-300 hover:-translate-y-1 hover:border-highlight/35"
    >
      <CardContent className="space-y-3 pt-4">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden rounded-xl bg-muted/20 ring-1 ring-inset ring-border/30">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(min-width: 1280px) 33vw, (min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-center text-xs font-semibold uppercase text-muted-foreground">
              No Image
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/22 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.category && (
            <>
              <span className="text-border">/</span>
              <span className="rounded-full bg-highlight/10 px-2 py-0.5 font-medium text-highlight">{post.category}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 font-heading text-lg font-semibold leading-tight transition-colors group-hover:text-highlight">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        {/* CTA Button */}
        <Button
          asChild
          variant="ghost"
          className="mt-2 inline-flex items-center gap-1 px-0 py-0 text-xs font-medium uppercase tracking-[0.12em] text-highlight hover:text-highlight/90"
        >
          <Link href={post.href} className="inline-flex items-center gap-1">
            Read More
            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
