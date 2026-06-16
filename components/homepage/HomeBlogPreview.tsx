import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeftRight, CalendarDays, Newspaper } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { urlFor } from "@/lib/sanity";
import { getLatestBlogPosts } from "@/lib/sanityClient";
import type { BlogPost } from "@/types/sanity";

type BlogCard = {
  title: string;
  href: string;
  excerpt: string;
  imageUrl: string;
  imageAlt: string;
  date: string;
};

function BlogPreviewCard({ post }: { post: BlogCard }) {
  return (
    <article className="group h-full rounded-2xl border border-border bg-card p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-lg sm:p-4">
      <Link href={post.href} className="block h-full">
        <div className="relative overflow-hidden rounded-xl border border-border/80 bg-muted/20">
          <div className="relative aspect-16/10 w-full">
            <Image
              src={post.imageUrl}
              alt={post.imageAlt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw"
            />
          </div>
        </div>

        <div className="mt-3.5 sm:mt-4">
          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {post.date}
          </p>
          <h3 className="mt-2 min-h-[2.6rem] line-clamp-2 text-base font-semibold leading-tight">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
}

function BlogSwipeHint() {
  return (
    <div className="mb-3 flex items-center justify-between rounded-2xl border border-border/70 bg-card/70 px-3 py-2 backdrop-blur-sm md:hidden">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
          <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <span>Swipe to see more posts</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/35" />
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
      </div>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) {
    return "Latest Update";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Latest Update";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function mapPostsToCards(posts: BlogPost[]) {
  return posts.slice(0, 3).map((post): BlogCard => {
    const imageSource = post.heroImage;
    const imageUrl = imageSource?.asset
      ? urlFor(imageSource).width(900).height(640).fit("crop").url()
      : "/images/supporting-page-hero.png";

    return {
      title: post.title,
      href: post.slug?.current ? `/blog/${post.slug.current}` : "/blog",
      excerpt:
        post.excerpt?.trim() ||
        "Read this update for THC vape industry insights, compliance news, and wholesale buying tips.",
      imageUrl,
      imageAlt: imageSource?.alt || `${post.title} article cover image`,
      date: formatDate(post.publishedAt),
    };
  });
}

async function getBlogCards() {
  try {
    const posts = await getLatestBlogPosts(3);
    return mapPostsToCards(posts);
  } catch {
    return [];
  }
}

type HomeBlogPreviewProps = {
  eyebrow: string;
  heading: string;
  description: string;
  emptyMessage: string;
  viewAllLabel: string;
};

export async function HomeBlogPreview({
  eyebrow,
  heading,
  description,
  emptyMessage,
  viewAllLabel,
}: HomeBlogPreviewProps) {
  const posts = await getBlogCards();

  return (
    <section className="bg-background text-foreground">
      <Container className="section-y">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-highlight sm:text-[11px] sm:tracking-[0.18em]">
            <span className="h-px w-8 bg-highlight/70" />
            {eyebrow}
            <span className="h-px w-8 bg-highlight/70" />
          </p>
          <h2 className="mt-2 font-heading text-2xl leading-tight sm:text-3xl lg:text-4xl">
            {heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>

        {posts.length > 0 ? (
          <>
            <div className="mt-8 md:hidden">
              <BlogSwipeHint />
              <Carousel opts={{ align: "start", loop: posts.length > 1 }} className="w-full">
                <CarouselContent className="ml-0">
                  {posts.map((post) => (
                    <CarouselItem key={`${post.title}-${post.date}`} className="basis-[88%] pl-0 pr-3">
                      <BlogPreviewCard post={post} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            <div className="mt-8 hidden gap-4 md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogPreviewCard key={`${post.title}-${post.date}`} post={post} />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="group/button w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,0,0,0.12)] sm:w-auto"
          >
            <Link href="/blog" className="inline-flex items-center gap-2">
              <Newspaper className="h-4 w-4" aria-hidden="true" />
              <span>{viewAllLabel}</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
