"use client";

import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { listLeadsAdmin } from "@/lib/firebase-data";
import type { Lead } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/form";
import { formatDate } from "@/lib/utils";

type LeadStatus = NonNullable<Lead["status"]>;

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

function csvEscape(value: string) {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function leadToRow(lead: Lead) {
  const status = (lead.status ?? "new") as LeadStatus;
  return [
    lead.id ?? "",
    lead.name ?? "",
    lead.phone ?? "",
    lead.email ?? "",
    lead.interest ?? "",
    lead.city ?? "",
    lead.source ?? "",
    lead.listingTitle ?? "",
    lead.listingUrl ?? "",
    (lead.message ?? "").replace(/\s+/g, " ").trim(),
    STATUS_LABEL[status] ?? status,
    status,
    formatDate(lead.createdAt),
    lead.createdAt ?? "",
    formatDate(lead.updatedAt),
    lead.updatedAt ?? "",
  ].map((v) => csvEscape(String(v)));
}

function downloadCsv(leads: Lead[]) {
  const header = [
    "ID",
    "Name",
    "Phone",
    "Email",
    "Interest",
    "City",
    "Source",
    "Listing",
    "Listing URL",
    "Message",
    "Status",
    "Status code",
    "Created",
    "Created (ISO)",
    "Last updated",
    "Last updated (ISO)",
  ];
  const lines = [header.join(","), ...leads.map((l) => leadToRow(l).join(","))];
  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `alvenhomz-leads-${stamp}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminReportsPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    listLeadsAdmin()
      .then(setLeads)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load leads"));
  }, []);

  const stats = useMemo(() => {
    if (!leads) return null;
    const counts = { total: leads.length, new: 0, contacted: 0, closed: 0 };
    for (const lead of leads) {
      const s = lead.status ?? "new";
      if (s === "new" || s === "contacted" || s === "closed") counts[s] += 1;
    }
    return counts;
  }, [leads]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reports"
        description="Download all leads with status progression for follow-up and CRM import."
        action={
          <button
            type="button"
            className="btn-primary text-sm"
            disabled={!leads || leads.length === 0}
            onClick={() => leads && downloadCsv(leads)}
          >
            <Download className="h-4 w-4" />
            Download CSV
          </button>
        }
      />

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {!leads && !error && <p className="text-sm text-muted">Loading…</p>}

      {stats && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total leads", value: stats.total },
            { label: "New", value: stats.new },
            { label: "Contacted", value: stats.contacted },
            { label: "Closed", value: stats.closed },
          ].map((item) => (
            <li key={item.label} className="card p-5">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">{item.label}</p>
              <p className="mt-2 font-display text-3xl font-semibold text-navy-900">{item.value}</p>
            </li>
          ))}
        </ul>
      )}

      {leads && leads.length === 0 && (
        <div className="card p-8 text-center text-sm text-muted">No leads to export yet.</div>
      )}

      {leads && leads.length > 0 && (
        <div className="card overflow-hidden">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-sans text-base font-bold text-navy-900">Lead progression preview</h2>
            <p className="mt-1 text-xs text-muted">
              CSV includes name, contact, source, listing, message, status, and dates.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-ivory text-xs tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Phone</th>
                  <th className="px-5 py-3 font-semibold">Source</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {leads.slice(0, 12).map((lead) => {
                  const status = (lead.status ?? "new") as LeadStatus;
                  return (
                    <tr key={lead.id}>
                      <td className="px-5 py-3 font-medium text-navy-900">{lead.name}</td>
                      <td className="px-5 py-3 text-navy-800">{lead.phone}</td>
                      <td className="px-5 py-3 text-muted">{lead.source}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            status === "new"
                              ? "bg-amber-50 text-amber-800"
                              : status === "contacted"
                                ? "bg-sky-50 text-sky-800"
                                : "bg-emerald-50 text-emerald-800"
                          }`}
                        >
                          {STATUS_LABEL[status]}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-muted">{formatDate(lead.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {leads.length > 12 && (
            <p className="border-t border-line px-5 py-3 text-xs text-muted">
              Showing 12 of {leads.length}. Download CSV for the full export.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
