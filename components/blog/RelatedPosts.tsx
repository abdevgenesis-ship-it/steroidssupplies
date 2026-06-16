import Link from "next/link";

import { RevealItem } from "@/components/motion/RevealItem";
import { Card, CardContent } from "@/components/ui/card";
import type { BlogCardData } from "@/components/blog/BlogCard";

type RelatedPostsProps = {
  posts: BlogCardData[];
};

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Related Posts</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {posts.slice(0, 3).map((post, index) => (
          <RevealItem key={post.id} delay={0.04 * index}>
            <Card className="overflow-hidden border-border/70 transition-all duration-300 hover:-translate-y-1 hover:border-highlight/35">
              <CardContent className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {post.category || "Blog"}
                </p>
                <h3 className="mt-3 line-clamp-2 font-heading text-lg font-semibold text-foreground group-hover:text-highlight">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <Link href={post.href} className="mt-4 inline-flex text-sm font-semibold text-highlight transition-colors hover:text-highlight/80">
                  Read More
                </Link>
              </CardContent>
            </Card>
          </RevealItem>
        ))}
      </div>
    </section>
  );
}
