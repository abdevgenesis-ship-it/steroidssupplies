"use client";

import { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { BlogCard, type BlogCardData } from "@/components/blog/BlogCard";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { FeaturedBlogPost } from "@/components/blog/FeaturedBlogPost";

type BlogContentClientProps = {
  cardData: BlogCardData[];
};

const POSTS_PER_PAGE = 6;

export function BlogContentClient({ cardData }: BlogContentClientProps) {
  const [filteredPosts, setFilteredPosts] = useState<BlogCardData[]>(cardData);
  const [postsDisplayed, setPostsDisplayed] = useState(POSTS_PER_PAGE);

  const [featured] = cardData;

  // Filter featured post if it matches filters
  const shouldShowFeatured = useMemo(
    () => filteredPosts.some((post) => post.id === featured?.id),
    [filteredPosts, featured]
  );

  const remainingFiltered = useMemo(
    () => filteredPosts.filter((post) => post.id !== featured?.id),
    [filteredPosts, featured]
  );

  // Slice remaining posts based on pagination
  const displayedRemainingPosts = useMemo(
    () => remainingFiltered.slice(0, postsDisplayed),
    [remainingFiltered, postsDisplayed]
  );

  // Check if there are more posts to load
  const hasMorePosts = remainingFiltered.length > postsDisplayed;

  const handleLoadMore = () => {
    setPostsDisplayed((prev) => prev + POSTS_PER_PAGE);
  };

  // Reset pagination when filters change
  const handleFilterChange = useCallback((filtered: BlogCardData[]) => {
    setFilteredPosts((prev) => {
      const unchanged =
        prev.length === filtered.length &&
        prev.every((item, index) => item.id === filtered[index]?.id);

      if (unchanged) {
        return prev;
      }

      setPostsDisplayed(POSTS_PER_PAGE);
      return filtered;
    });
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
      {/* Main Content */}
      <div className="lg:col-span-2">
        {/* Featured Post */}
        {shouldShowFeatured && featured && (
          <FeaturedBlogPost post={featured} />
        )}

        {/* Remaining Posts Grid */}
        {displayedRemainingPosts.length > 0 && (
          <div className={shouldShowFeatured ? "mt-8 sm:mt-10" : ""}>
            <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-highlight/80">
                  Editorial archive
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">
                  {shouldShowFeatured ? "More Articles" : "All Articles"}
                </h2>
              </div>
              <div className="hidden rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm sm:block">
                Curated for wholesale operators
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {displayedRemainingPosts.map((post) => (
                <div key={post.id}>
                  <BlogCard post={post} />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMorePosts && (
              <div className="mt-8 flex justify-center">
                <Button
                  type="button"
                  onClick={handleLoadMore}
                  variant="outline"
                  size="lg"
                  className="border border-border bg-background px-6 transition-all duration-300 hover:border-highlight/40 hover:bg-highlight/5 hover:text-highlight"
                >
                  Load More Articles
                </Button>
              </div>
            )}
          </div>
        )}

        {/* No Posts */}
        {filteredPosts.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <p>No articles match your filters. Try adjusting your search.</p>
          </div>
        )}

        {/* No Featured Post but Has Remaining */}
        {!shouldShowFeatured && filteredPosts.length === 1 && (
          <div className="rounded-lg border border-border bg-muted/30 px-6 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              This is the only article matching your filters.
            </p>
          </div>
        )}
      </div>

      {/* Sidebar (Desktop Only) */}
      <div className="hidden lg:block">
        <BlogSidebar posts={cardData} onFilterChange={handleFilterChange} />
      </div>
    </div>
  );
}
