import Link from "next/link";
import { Home } from "lucide-react";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">This space isn&apos;t available</h1>
      <p className="mt-4 max-w-md text-muted">The page you&apos;re looking for may have moved, or the listing is no longer on the market.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          <Home className="h-4 w-4" /> Back to home
        </Link>
        <Link href="/new-projects/" className="btn-outline">Browse new projects</Link>
      </div>
    </section>
  );
}
