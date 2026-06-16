import type { Metadata } from "next";
import Link from "next/link";

import type { BlogCardData } from "@/components/blog/BlogCard";
import { BlogContentClient } from "@/components/blog/BlogContentClient";
import { Container } from "@/components/layout/container";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import { urlFor } from "@/lib/sanity";
import { getAllBlogPosts } from "@/lib/sanityClient";

export const metadata: Metadata = {
  title: `Performance & AAS Industry Insights | ${SITE_NAME}`,
  description:
    "Expert guides on anabolic steroids, cycle protocols, compound profiles, and wholesale buying strategies for athletes and B2B buyers.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: `Performance & AAS Industry Insights | ${SITE_NAME}`,
    description:
      "Expert guides on anabolic steroids, cycle protocols, compound profiles, and wholesale buying strategies for athletes and B2B buyers.",
    siteName: SITE_NAME,
  },
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  // Transform Sanity BlogPost to BlogCardData
  const cardData: BlogCardData[] = posts.map((post) => ({
    id: post._id,
    title: post.title,
    slug: post.slug.current,
    excerpt: post.excerpt || "Read this update for wholesale insights and category trends.",
    image: post.heroImage ? urlFor(post.heroImage).width(1200).height(720).fit("crop").url() : undefined,
    imageAlt: post.heroImage?.alt || post.title,
    publishedAt: post.publishedAt || new Date().toISOString(),
    category: post.category?.name || post.category?.group || undefined,
    href: `/blog/${post.slug.current}`,
  }));

  return (
    <main className="relative overflow-hidden bg-background pb-14 text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10rem] top-[-8rem] h-96 w-96 rounded-full bg-highlight/10 blur-3xl" />
        <div className="absolute right-[-9rem] top-32 h-[28rem] w-[28rem] rounded-full bg-foreground/5 blur-3xl" />
        <div className="absolute inset-x-0 top-[18rem] h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      </div>

      <SectionReveal y={14}>
        <section className="border-section-b bg-surface-elevated backdrop-blur-sm">
          <Container className="py-10 sm:py-12 lg:py-14">
            <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.22em] text-muted-foreground/90">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="underline-offset-4 hover:underline">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-foreground">Blog</li>
              </ol>
            </nav>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-highlight shadow-sm">
              <span className="h-2 w-2 rounded-full bg-highlight animate-pulse" />
              Editorial Desk
            </div>
            <div className="mt-5 max-w-4xl">
              <h1 className="font-heading text-4xl leading-[1.04] sm:text-5xl lg:text-6xl">
                Performance & AAS Industry Insights
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Expert guides, cycle protocols, compound profiles, and wholesale strategies for athletes and B2B buyers.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-foreground shadow-sm">
                Premium sourcing notes
              </span>
              <span className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-foreground shadow-sm">
                Category trend breakdowns
              </span>
              <span className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-foreground shadow-sm">
                Wholesale growth tactics
              </span>
            </div>
          </Container>
        </section>
      </SectionReveal>

      <SectionReveal delay={0.02}>
        <Container className="pt-8 sm:pt-10">
          <BlogContentClient cardData={cardData} />
        </Container>
      </SectionReveal>
    </main>
  );
}
