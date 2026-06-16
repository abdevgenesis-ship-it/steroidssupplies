"use client"

import Image from "next/image"
import Link from "next/link"

import type { BlogCardData } from "@/components/blog/BlogCard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { urlFor } from "@/lib/sanity"
import { RevealItem } from "@/components/motion/RevealItem"

export type PortableTextBlock = {
  _type?: string
  style?: string
  children?: Array<{ text?: string; marks?: string[] }>
  markDefs?: Array<{ _key?: string; _type?: string; href?: string }>
  asset?: { _ref?: string }
  alt?: string
}

type BlogBodyProps = {
  body: PortableTextBlock[]
  relatedPosts?: BlogCardData[]
  authorName?: string
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function getBlockText(block: PortableTextBlock) {
  return (block.children || [])
    .map((child) => child.text || "")
    .join("")
    .trim()
}

function renderInlineChildren(block: PortableTextBlock) {
  return (block.children || []).map((child, childIndex) => {
    const text = child.text || ""
    if (!text) {
      return null
    }

    const key = `${text}-${childIndex}`

    if (child.marks?.includes("strong")) {
      return (
        <strong key={key} className="font-semibold text-foreground">
          {text}
        </strong>
      )
    }

    return <span key={key}>{text}</span>
  })
}

export function BlogBody({
  body,
  relatedPosts = [],
  authorName,
}: BlogBodyProps) {
  return (
    <div className="bg-surface-panel space-y-8 rounded-[2rem] border border-border p-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:p-8 lg:p-10">
      {body.map((block, index) => {
        if (block._type === "block" && block.style === "h2") {
          const heading = getBlockText(block)
          const id = slugify(heading || `section-${index + 1}`)

          return (
            <RevealItem key={`${id}-${index}`} delay={0.02 * index}>
              <h2
                id={id}
                className="scroll-mt-28 border-l-4 border-highlight/70 pl-4 font-heading text-2xl font-bold text-foreground"
              >
                {heading}
              </h2>
            </RevealItem>
          )
        }

        if (block._type === "block" && block.style === "h3") {
          const heading = getBlockText(block)
          const id = slugify(heading || `section-${index + 1}`)

          return (
            <RevealItem key={`${id}-${index}`} delay={0.02 * index}>
              <h3
                id={id}
                className="scroll-mt-28 font-heading text-xl font-semibold text-foreground"
              >
                {heading}
              </h3>
            </RevealItem>
          )
        }

        if (block._type === "image") {
          const image = block as PortableTextBlock & {
            asset?: { _ref?: string }
          }
          if (!image.asset?._ref) {
            return null
          }

          return (
            <RevealItem key={`image-${index}`} delay={0.02 * index}>
              <figure className="overflow-hidden rounded-3xl border border-border bg-muted/20 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
                <div className="relative aspect-video">
                  <Image
                    src={urlFor({ _type: "image", asset: image.asset } as never)
                      .width(1200)
                      .height(675)
                      .fit("crop")
                      .url()}
                    alt={image.alt || "Blog image"}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 720px, 100vw"
                  />
                </div>
              </figure>
            </RevealItem>
          )
        }

        const paragraph = getBlockText(block)
        if (!paragraph) {
          return null
        }

        return (
          <RevealItem key={`p-${index}`} delay={0.015 * index}>
            <p className="text-[17px] leading-8 text-muted-foreground sm:text-lg">
              {renderInlineChildren(block)}
            </p>
          </RevealItem>
        )
      })}

      {relatedPosts.length > 0 && (
        <RevealItem delay={0.08}>
          <Card className="bg-surface-panel-diagonal border border-border p-6 shadow-[0_16px_40px_rgba(0,0,0,0.06)] sm:p-7">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Also read
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {relatedPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  href={post.href}
                  className="group rounded-2xl border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-highlight/30 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
                >
                  <p className="line-clamp-2 font-heading text-base font-semibold text-foreground group-hover:text-highlight">
                    {post.title}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </Card>
        </RevealItem>
      )}

      <RevealItem delay={0.1}>
        <Card className="bg-surface-panel-diagonal border border-border p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)] sm:p-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Ready to order?
          </p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Browse our wholesale catalog
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Use these insights to make better buying decisions, then compare
                live products and categories.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/products">Shop Wholesale</Link>
            </Button>
          </div>
        </Card>
      </RevealItem>

      {authorName && (
        <RevealItem delay={0.12}>
          <Card className="bg-surface-panel border border-border p-6 shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              About the Author
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              This article was prepared for THCPensBulk by {authorName}{" "}
              to support cannabis retailers and wholesale buyers with practical
              industry and operations insight.
            </p>
          </Card>
        </RevealItem>
      )}
    </div>
  )
}
