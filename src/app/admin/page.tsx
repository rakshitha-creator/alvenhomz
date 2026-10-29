"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, FileText, Inbox, KeyRound, RefreshCw } from "lucide-react";
import { listAllAdmin, listLeadsAdmin } from "@/lib/firebase-data";
import type { Lead } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/form";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({
    projects: 0,
    projectsPublished: 0,
    resale: 0,
    rentals: 0,
    blogs: 0,
    leads: 0,
    leadsNew: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);

  useEffect(() => {
    Promise.all([
      listAllAdmin<Record<string, unknown>>("projects"),
      listAllAdmin("resaleProperties"),
      listAllAdmin("rentalProperties"),
      listAllAdmin("blogs"),
      listLeadsAdmin(),
    ]).then(([projects, resale, rentals, blogs, leads]) => {
      setCounts({
        projects: projects.length,
        projectsPublished: projects.filter((p) => p.published !== false).length,
        resale: resale.length,
        rentals: rentals.length,
        blogs: blogs.length,
        leads: leads.length,
        leadsNew: leads.filter((l) => (l.status ?? "new") === "new").length,
      });
      setRecentLeads(leads.slice(0, 5));
    });
  }, []);

  const cards = [
    { href: "/admin/leads/", label: "New leads", value: counts.leadsNew, sub: `${counts.leads} total`, icon: Inbox },
    { href: "/admin/projects/", label: "Projects", value: counts.projects, sub: `${counts.projectsPublished} published`, icon: Building2 },
    { href: "/admin/resale/", label: "Resale", value: counts.resale, sub: "Listings", icon: RefreshCw },
    { href: "/admin/rentals/", label: "Rentals", value: counts.rentals, sub: "Listings", icon: KeyRound },
    { href: "/admin/blogs/", label: "Blogs", value: counts.blogs, sub: "Articles", icon: FileText },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Projects, resale, rentals, blogs, banners and leads are live from Firestore. Edits here show on the website without a rebuild."
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <li key={c.href}>
            <Link href={c.href} className="card block p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">{c.label}</p>
                <span className="rounded-xl bg-navy-900 p-2 text-gold-300">
                  <c.icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 font-display text-3xl font-semibold text-navy-900">{c.value}</p>
              <p className="mt-1 text-xs text-muted">{c.sub}</p>
            </Link>
          </li>
        ))}
      </ul>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-sans text-base font-bold">Recent leads</h2>
            <Link href="/admin/leads/" className="inline-flex items-center gap-1 text-xs font-semibold text-gold-600 hover:text-navy-900">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="px-5 py-10 text-sm text-muted">No leads yet. Enquiries from contact/listing forms will appear here.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentLeads.map((lead) => (
                <li key={lead.id} className="px-5 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-navy-900">{lead.name}</p>
                      <p className="text-xs text-muted">
                        {lead.phone}
                        {lead.interest ? ` · ${lead.interest}` : ""}
                      </p>
                      {lead.listingTitle && <p className="mt-1 truncate text-xs text-navy-800">{lead.listingTitle}</p>}
                    </div>
                    <div className="shrink-0 text-right">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${(lead.status ?? "new") === "new" ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"}`}>
                        {lead.status ?? "new"}
                      </span>
                      <p className="mt-1 text-[11px] text-muted">{formatDate(lead.createdAt)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card space-y-3 p-5">
          <h2 className="font-sans text-base font-bold">Quick actions</h2>
          <Link href="/admin/projects/new/" className="btn-primary w-full justify-center text-sm">
            Add new project
          </Link>
          <Link href="/admin/blogs/new/" className="btn-outline w-full justify-center text-sm">
            Add blog post
          </Link>
          <Link href="/admin/projects/" className="btn-outline w-full justify-center text-sm">
            Edit projects
          </Link>
          <p className="pt-2 text-xs leading-relaxed text-muted">
            Project editor sections: About, Plans, Amenities, Location, Gallery, Walkthrough, FAQs, Contact, Testimonials.
          </p>
        </div>
      </section>
    </div>
  );
}
