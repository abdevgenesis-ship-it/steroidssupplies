"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import type { BlogCardData } from "@/components/blog/BlogCard";

type BlogSidebarProps = {
  posts: BlogCardData[];
  onFilterChange?: (filtered: BlogCardData[]) => void;
};

export function BlogSidebar({ posts, onFilterChange }: BlogSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(posts.map((post) => post.category).filter((value): value is string => Boolean(value)))
      ).sort((a, b) => a.localeCompare(b)),
    [posts]
  );

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategories.length === 0 ||
        (post.category && selectedCategories.includes(post.category));

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategories]);

  useEffect(() => {
    onFilterChange?.(filteredPosts);
  }, [filteredPosts, onFilterChange]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
  };

  return (
    <aside className="space-y-6">
      {/* Search Bar */}
      <Card className="border border-border bg-surface-panel p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-highlight/80">
          Search
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
            aria-label="Search blog articles"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </Card>

      {/* Category Filter */}
      <Card className="border border-border bg-surface-panel p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
        <h3 className="mb-3 font-semibold text-sm uppercase tracking-[0.2em]">
          Categories
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-muted/50"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                aria-label={`Filter by ${category}`}
                className="h-4 w-4 rounded border border-border text-highlight accent-highlight"
              />
              <span className="text-sm text-foreground">{category}</span>
            </label>
          ))}
        </div>

        {/* Clear Filters Button */}
        {(searchQuery || selectedCategories.length > 0) && (
          <button
            onClick={clearFilters}
            className="mt-4 w-full rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-highlight/30 hover:bg-highlight/5"
          >
            Clear All Filters
          </button>
        )}
      </Card>

      {/* Popular Posts */}
      <Card className="border border-border bg-surface-panel p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
        <h3 className="mb-3 font-semibold text-sm uppercase tracking-[0.2em]">
          Popular
        </h3>
        <div className="space-y-2">
          {posts.slice(0, 5).map((post) => (
            <Link
              key={post.id}
              href={post.href}
              className="group block rounded-xl border border-transparent px-3 py-2 transition-all hover:border-primary/25 hover:bg-background hover:shadow-sm"
            >
              <p className="line-clamp-2 text-xs font-medium leading-snug text-foreground group-hover:text-highlight">
                {post.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </Link>
          ))}
        </div>
      </Card>

      {/* Filter Results Summary */}
      {(searchQuery || selectedCategories.length > 0) && (
        <div className="rounded-2xl border border-highlight/15 bg-highlight/5 px-4 py-3 text-xs text-muted-foreground shadow-sm">
          Found <span className="font-semibold text-foreground">{filteredPosts.length}</span> {" "}
          article{filteredPosts.length !== 1 ? "s" : ""}
        </div>
      )}
    </aside>
  );
}
