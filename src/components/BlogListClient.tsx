"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { listPublishedBlogs } from "@/lib/firebase-data";
import { isFirebaseConfigured } from "@/lib/firebase";
import blogSlugs from "@/data/blogSlugs.json";
import { formatDate, img } from "@/lib/utils";

function blogHref(slug: string) {
  // Known build-time slugs use pretty URLs; new CMS posts use query route (works in next/dev + static export).
  if ((blogSlugs as string[]).includes(slug)) return `/blogs/${slug}/`;
  return `/blogs/post/?slug=${encodeURIComponent(slug)}`;
}

export default function BlogListClient() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isFirebaseConfigured()) {
        if (!cancelled) setPosts([]);
        return;
      }
      try {
        const rows = await listPublishedBlogs();
        if (!cancelled) setPosts(rows);
      } catch {
        if (!cancelled) setPosts([]);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!posts) {
    return (
      <p className="text-sm text-muted" aria-busy="true">
        Loading articles…
      </p>
    );
  }

  if (!posts.length) {
    return (
      <div className="card px-6 py-16 text-center">
        <h2 className="text-xl font-semibold">No articles yet</h2>
        <p className="mt-2 text-sm text-muted">Check back soon for insights on buying, renting and interiors.</p>
      </div>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.slug}>
          <article className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lift">
            <Link href={blogHref(post.slug)} className="block overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden bg-sand">
                {post.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img(post.coverImage, "sm")}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : null}
              </div>
            </Link>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">{formatDate(post.publishedAt)}</p>
              <h2 className="mt-2 text-xl font-semibold text-navy-900">
                <Link href={blogHref(post.slug)} className="hover:text-gold-600">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted">{post.excerpt}</p>
              <Link
                href={blogHref(post.slug)}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 hover:text-navy-900"
              >
                Read more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
