import BlogListClient from "@/components/BlogListClient";
import { PageHero } from "@/components/ui";
import { getBlogs } from "@/lib/server-data";
import { pageMetadata } from "@/lib/seo";
import { img } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Blogs – Home Buying, Renting & Interiors Insights",
  description: "Guides and updates on buying, selling, renting and interiors across Bengaluru from the Alven Homz team.",
  path: "/blogs/",
  image: "living-white",
});

export default async function BlogsPage() {
  const posts = await getBlogs();
  return (
    <>
      <PageHero
        bannerId="blogs"
        eyebrow="Blogs"
        title="Insights for Homebuyers & Investors"
        description="Practical guidance on new projects, resale, rentals and interiors — written by the Alven Homz team."
        image={img("living-white")}
      />
      <section className="container-x py-12 sm:py-16">
        <BlogListClient initial={posts} />
      </section>
    </>
  );
}
