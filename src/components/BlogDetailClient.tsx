"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { BlogPost } from "@/lib/types";
import { getBlogBySlug } from "@/lib/firebase-data";
import { isFirebaseConfigured } from "@/lib/firebase";
import { formatDate, img } from "@/lib/utils";
import { useResolvedSlug } from "@/hooks/useResolvedSlug";

export default function BlogDetailClient({ fromQuery = false, initial }: { fromQuery?: boolean; initial?: BlogPost }) {
  const pathSlug = useResolvedSlug("blogs");
  // Query-route posts read ?slug= after mount, so path-route articles render fully in the static HTML (no Suspense fallback).
  const [querySlug, setQuerySlug] = useState("");
  useEffect(() => {
    if (fromQuery) setQuerySlug(new URLSearchParams(window.location.search).get("slug") ?? "");
  }, [fromQuery]);
  const slug = fromQuery ? querySlug : pathSlug || initial?.slug || "";
  const [post, setPost] = useState<BlogPost | null | undefined>(initial);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!slug) {
        if (!fromQuery && !initial) setPost(null);
        return;
      }
      if (!isFirebaseConfigured()) {
        if (!cancelled && !initial) setPost(null);
        return;
      }
      try {
        const item = await getBlogBySlug(slug);
        if (!cancelled && (item || !initial)) setPost(item);
      } catch {
        if (!cancelled && !initial) setPost(null);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug, initial, fromQuery]);

  useEffect(() => {
    if (post?.title) document.title = `${post.title} | Alven Homz`;
  }, [post]);

  if (post === undefined) return <div className="container-x py-20 text-sm text-muted">Loading…</div>;
  if (!post) {
    return (
      <div className="container-x py-20 text-center">
        <h1 className="text-2xl font-semibold">Article not found</h1>
        <Link href="/blogs/" className="mt-4 inline-block text-sm font-semibold text-gold-600">
          Back to blogs
        </Link>
      </div>
    );
  }

  return (
    <article className="container-x py-12 sm:py-16">
      <nav className="text-xs text-muted">
        <Link href="/" className="hover:text-navy-900">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blogs/" className="hover:text-navy-900">
          Blogs
        </Link>
        <span className="mx-2">/</span>
        <span className="text-navy-800">{post.title}</span>
      </nav>
      <header className="mx-auto mt-8 max-w-3xl text-center">
        <p className="text-xs font-semibold tracking-wide text-muted uppercase">
          {formatDate(post.publishedAt)} · {post.author}
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-900 sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-base text-muted">{post.excerpt}</p>
      </header>
      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img(post.coverImage)} alt={post.title} width={1600} height={686} className="mx-auto mt-10 aspect-[21/9] w-full max-w-5xl rounded-3xl object-cover" />
      )}
      <div className="prose-alven mx-auto mt-10 max-w-3xl space-y-4 text-[15px] leading-relaxed text-navy-800 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-navy-900 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_a]:font-semibold [&_a]:text-gold-600 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
        <ReactMarkdown>{post.body}</ReactMarkdown>
      </div>
    </article>
  );
}
