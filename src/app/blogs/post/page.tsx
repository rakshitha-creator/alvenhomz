import type { Metadata } from "next";
import { Suspense } from "react";
import BlogDetailClient from "@/components/BlogDetailClient";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: "Alven Homz articles and guides.",
  path: "/blogs/",
});

function PostInner() {
  return <BlogDetailClient fromQuery />;
}

export default function BlogPostQueryPage() {
  return (
    <Suspense fallback={<div className="container-x py-20 text-sm text-muted">Loading…</div>}>
      <PostInner />
    </Suspense>
  );
}
