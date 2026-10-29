import BlogListClient from "@/components/BlogListClient";
import { PageHero } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { img } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Blogs – Real Estate Insights from Alven Homz",
  description: "Guides and updates on buying, selling, renting and interiors across Bangalore from the Alven Homz team.",
  path: "/blogs/",
  image: "living-white",
});

export default function BlogsPage() {
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
        <BlogListClient />
      </section>
    </>
  );
}
