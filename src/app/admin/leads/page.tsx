"use client";

import { useEffect, useState } from "react";
import { listLeadsAdmin, updateLeadStatus } from "@/lib/firebase-data";
import type { Lead } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/form";
import { formatDate } from "@/lib/utils";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState("");

  const load = () =>
    listLeadsAdmin()
      .then(setLeads)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load leads"));

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string | undefined, status: Lead["status"]) => {
    if (!id) return;
    await updateLeadStatus(id, status);
    await load();
  };

  return (
    <div>
      <AdminPageHeader title="Leads" description="Enquiries captured from website forms (plus WhatsApp/email handoff)." />
      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {!leads && !error && <p className="text-sm text-muted">Loading…</p>}
      {leads && leads.length === 0 && <div className="card p-8 text-center text-sm text-muted">No leads yet.</div>}
      {leads && leads.length > 0 && (
        <ul className="card divide-y divide-line overflow-hidden">
          {leads.map((lead) => (
            <li key={lead.id} className="grid gap-3 px-4 py-4 sm:grid-cols-[1fr_auto] sm:px-5">
              <div className="min-w-0">
                <p className="font-semibold text-navy-900">{lead.name}</p>
                <p className="text-sm text-navy-800">
                  <a href={`tel:${lead.phone}`} className="hover:underline">
                    {lead.phone}
                  </a>
                  {lead.email ? ` · ${lead.email}` : ""}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {lead.source}
                  {lead.interest ? ` · ${lead.interest}` : ""}
                  {lead.city ? ` · ${lead.city}` : ""}
                  {" · "}
                  {formatDate(lead.createdAt)}
                </p>
                {lead.listingTitle && <p className="mt-1 text-xs font-medium text-navy-800">{lead.listingTitle}</p>}
                {lead.message && <p className="mt-2 text-sm text-muted">{lead.message}</p>}
              </div>
              <div className="flex flex-wrap items-start gap-2">
                <select
                  className="input w-auto py-2 text-xs"
                  value={lead.status ?? "new"}
                  onChange={(e) => setStatus(lead.id, e.target.value as Lead["status"])}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
