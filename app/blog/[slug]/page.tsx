import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogBody, type PortableTextBlock } from "@/components/blog/BlogBody";
import type { BlogCardData } from "@/components/blog/BlogCard";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { Container } from "@/components/layout/container";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import { urlFor } from "@/lib/sanity";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/sanityClient";
import { SectionReveal } from "@/components/motion/SectionReveal";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractToc(body: unknown): TocItem[] {
  if (!Array.isArray(body)) {
    return [];
  }

  const items: TocItem[] = [];

  for (const block of body) {
    if (!block || typeof block !== "object") {
      continue;
    }

    const maybeBlock = block as { _type?: string; style?: string; children?: Array<{ text?: string }> };
    if (maybeBlock._type !== "block" || !["h2", "h3"].includes(maybeBlock.style || "")) {
      continue;
    }

    const text = (maybeBlock.children || []).map((child) => child.text || "").join("").trim();
    if (!text) {
      continue;
    }

    items.push({
      id: slugify(text),
      text,
      level: maybeBlock.style === "h3" ? 3 : 2,
    });
  }

  return items;
}

function transformToCardData(
  post: Awaited<ReturnType<typeof getAllBlogPosts>>[number],
): BlogCardData {
  return {
    id: post._id,
    title: post.title,
    slug: post.slug.current,
    excerpt: post.excerpt || "Read this update for wholesale insights and category trends.",
    image: post.heroImage ? urlFor(post.heroImage).width(1200).height(720).fit("crop").url() : undefined,
    imageAlt: post.heroImage?.alt || post.title,
    publishedAt: post.publishedAt || new Date().toISOString(),
    category: post.category?.name || post.category?.group || undefined,
    href: `/blog/${post.slug.current}`,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: `Blog Post | ${SITE_NAME}`,
    };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || `Sleep and wellness insights from ${SITE_NAME}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/blog/${slug}`,
      title,
      description,
      siteName: SITE_NAME,
      images: post.heroImage
        ? [
            {
              url: urlFor(post.heroImage).width(1200).height(630).fit("crop").url(),
              width: 1200,
              height: 630,
              alt: post.heroImage.alt || post.title,
            },
          ]
        : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getBlogPostBySlug(slug), getAllBlogPosts()]);

  if (!post) {
    notFound();
  }

  const cardData = allPosts.map(transformToCardData);
  const currentCard = transformToCardData(post);
  const tocItems = extractToc(post.body);

  const relatedFromField =
    (post.relatedPosts || [])
      .map((item) => {
        if (!item.slug?.current) {
          return null;
        }

        return {
          id: item._id,
          title: item.title || "Related post",
          slug: item.slug.current,
          excerpt: "Continue reading for more wholesale insights.",
          image: item.heroImage ? urlFor(item.heroImage).width(1200).height(720).fit("crop").url() : undefined,
          imageAlt: item.title || "Related post image",
          publishedAt: item.publishedAt || new Date().toISOString(),
          category: post.category?.name || post.category?.group || undefined,
          href: `/blog/${item.slug.current}`,
        } as BlogCardData;
      })
      .filter(Boolean) as BlogCardData[];

  const relatedFallback = cardData
    .filter((item) => item.id !== post._id)
    .filter((item) => item.category === currentCard.category)
    .slice(0, 3);

  const relatedPosts = relatedFromField.length > 0 ? relatedFromField.slice(0, 3) : relatedFallback;
  const authorName = post.author?.name || `${SITE_NAME} Editorial Team`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt,
    author: {
      "@type": "Person",
      name: authorName,
    },
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
    image: post.heroImage ? urlFor(post.heroImage).width(1200).height(630).fit("crop").url() : undefined,
  };

  return (
    <main className="relative overflow-hidden bg-background pb-16 text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-24 h-80 w-80 rounded-full bg-highlight/10 blur-3xl" />
        <div className="absolute -right-28 top-48 h-96 w-96 rounded-full bg-foreground/5 blur-3xl" />
        <div className="absolute inset-x-0 top-104 h-px bg-linear-to-r from-transparent via-border/50 to-transparent" />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <SectionReveal y={18}>
        <section className="border-section-b bg-surface-elevated backdrop-blur-sm">
          <Container className="py-8 sm:py-10 lg:py-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-highlight shadow-sm">
              <span className="h-2 w-2 rounded-full bg-highlight animate-pulse" />
              Editorial Insight
            </div>

            <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="underline-offset-4 hover:underline">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/blog" className="underline-offset-4 hover:underline">
                    Blog
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-foreground">{post.title}</li>
              </ol>
            </nav>

            <div className="mt-6">
              <h1 className="max-w-4xl font-heading text-3xl leading-tight sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="rounded-full border border-border bg-background px-3 py-1 text-foreground shadow-sm">
                  {authorName}
                </span>
                <span aria-hidden>•</span>
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt || post._createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                {post.estimatedReadMinutes ? (
                  <>
                    <span aria-hidden>•</span>
                    <span className="rounded-full bg-highlight/10 px-3 py-1 text-highlight">
                      {post.estimatedReadMinutes} min read
                    </span>
                  </>
                ) : null}
              </div>

              <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Wholesale insight designed for operators who want stronger margins, cleaner ordering decisions, and more efficient category planning.
              </p>
            </div>

            {post.heroImage && (
              <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-muted/20 shadow-[0_24px_80px_rgba(0,0,0,0.14)]">
                <div className="relative aspect-video">
                  <Image
                    src={urlFor(post.heroImage).width(1600).height(900).fit("crop").url()}
                    alt={post.heroImage.alt || post.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(min-width: 1024px) 1200px, 100vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.18)_100%)]" />
                </div>
              </div>
            )}
          </Container>
        </section>
      </SectionReveal>

      <SectionReveal y={24} delay={0.05}>
        <Container className="pt-10">
          <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="hidden lg:block">
              <div className="sticky top-28 space-y-6">
                <TableOfContents items={tocItems} />
                {post.category?.name && (
                  <div className="rounded-2xl border border-border bg-surface-panel p-5 shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Category</p>
                    <p className="mt-3 font-heading text-lg font-semibold">{post.category.name}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-12">
              <BlogBody body={(post.body || []) as PortableTextBlock[]} relatedPosts={relatedPosts} authorName={authorName} />
              <RelatedPosts posts={relatedPosts} />
            </div>
          </div>
        </Container>
      </SectionReveal>
    </main>
  );
}
