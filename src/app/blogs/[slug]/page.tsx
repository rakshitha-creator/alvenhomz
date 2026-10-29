import type { Metadata } from "next";
import { Suspense } from "react";
import BlogDetailClient from "@/components/BlogDetailClient";
import blogSlugs from "@/data/blogSlugs.json";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return [...blogSlugs.map((slug) => ({ slug })), { slug: "_" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  if (slug === "_") {
    return pageMetadata({ title: "Blog", description: "Alven Homz articles and guides.", path: "/blogs/" });
  }
  return pageMetadata({
    title: "Blog",
    description: "Alven Homz articles and guides.",
    path: `/blogs/${slug}/`,
  });
}

export default function BlogDetailPage() {
  return (
    <Suspense fallback={<div className="container-x py-20 text-sm text-muted">Loading…</div>}>
      <BlogDetailClient />
    </Suspense>
  );
}
