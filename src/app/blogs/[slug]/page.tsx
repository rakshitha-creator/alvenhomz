import type { Metadata } from "next";
import BlogDetailClient from "@/components/BlogDetailClient";
import JsonLd from "@/components/JsonLd";
import blogSlugs from "@/data/blogSlugs.json";
import { site } from "@/lib/data";
import { getBlogs } from "@/lib/server-data";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { img } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = new Set([...(blogSlugs as string[]), ...(await getBlogs()).map((b) => b.slug)]);
  return [...slugs, "_"].map((slug) => ({ slug }));
}

const find = async (slug: string) => (await getBlogs()).find((b) => b.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const post = slug === "_" ? undefined : await find(slug);
  if (!post) return pageMetadata({ title: "Blog", description: "Alven Homz articles and guides.", path: "/blogs/" });
  return pageMetadata({
    title: post.title,
    description: post.excerpt.length > 155 ? `${post.excerpt.slice(0, 152).trimEnd()}…` : post.excerpt,
    path: `/blogs/${post.slug}/`,
    image: post.coverImage || "living-white",
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const slug = (await params).slug;
  const post = slug === "_" ? undefined : await find(slug);
  return (
    <>
      {post && (
        <>
          <JsonLd
            data={breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Blogs", path: "/blogs/" },
              { name: post.title, path: `/blogs/${post.slug}/` },
            ])}
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt,
              datePublished: post.publishedAt,
              author: { "@type": "Organization", name: post.author || site.name },
              publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: absoluteUrl("/images/brand/logo-dark.png") } },
              ...(post.coverImage ? { image: absoluteUrl(img(post.coverImage)) } : {}),
              mainEntityOfPage: absoluteUrl(`/blogs/${post.slug}/`),
            }}
          />
        </>
      )}
      <BlogDetailClient initial={post} />
    </>
  );
}
