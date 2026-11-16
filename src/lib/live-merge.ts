import type { Project, RentalProperty, ResaleProperty } from "./types";

type Listing = Project | ResaleProperty | RentalProperty;

/**
 * Combines the built-in (site data) and live (admin/Firebase) copies of a listing. Only admin-saved copies count.
 * The newer one wins field by field; fields only one side has (e.g. FAQs added in the admin) are always kept.
 * Returns null when there is nothing live to apply.
 */
export function mergeLive<T extends Listing>(built: T | undefined, live: T | null | undefined): T | null {
  if (!live?.editedInAdmin) return null;
  const liveFields = withoutEmpty(live) as Partial<T>;
  if (!built) return live;
  const hl = (liveFields as { highlights?: string[] }).highlights;
  if (Array.isArray(hl)) (liveFields as { highlights?: string[] }).highlights = repairSplitList(hl, (built as { highlights?: string[] }).highlights);
  const siteIsNewer = !!built.contentUpdatedAt && !!live.liveUpdatedAt && built.contentUpdatedAt > live.liveUpdatedAt;
  return (siteIsNewer ? { ...liveFields, ...built } : { ...built, ...liveFields }) as T;
}

/** Drop null/undefined/empty-array fields so an incomplete copy doesn't blank out the other one's details. */
function withoutEmpty(o: object) {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0)));
}

/**
 * What the admin edit form should start from: the admin copy, unless the website's built-in copy is newer
 * (never saved in the admin, or site content updated after the last admin save) — then the website's fields and
 * images are loaded on top, keeping admin-only fields. `fromSite` tells the form to show a "click Save" notice.
 */
export function adminStartingPoint<T extends Listing>(built: T | undefined, admin: T | null): { item: T | null; fromSite: boolean } {
  if (!built) return { item: admin, fromSite: false };
  if (!admin) return { item: built, fromSite: true };
  const siteIsNewer = !admin.editedInAdmin || (!!built.contentUpdatedAt && (!admin.liveUpdatedAt || built.contentUpdatedAt > admin.liveUpdatedAt));
  return siteIsNewer ? { item: { ...admin, ...built } as T, fromSite: true } : { item: admin, fromSite: false };
}

/**
 * Undoes the old admin form bug that saved list fields split at every comma ("2 BHK (1" / "205 – 1,300 sq.ft)").
 * If the pieces rebuild one of the built-in lists exactly, the built-in list is used. Otherwise a piece is glued back
 * on only when it clearly continues the previous one: the previous piece has an unclosed "(", or it ends in a digit and
 * the piece starts with exactly three digits (a split thousands separator, e.g. "1" + "205 – 1").
 */
export function repairSplitList(list: string[], builtIn?: string[]): string[] {
  const squash = (a: string[]) => a.join(",").replace(/\s+/g, "");
  if (builtIn?.length && squash(list) === squash(builtIn)) return builtIn;
  const out: string[] = [];
  for (const raw of list) {
    const piece = String(raw).trim();
    if (!piece) continue;
    const prev = out[out.length - 1];
    const unclosed = prev !== undefined && (prev.match(/\(/g)?.length ?? 0) > (prev.match(/\)/g)?.length ?? 0);
    const thousands = prev !== undefined && /\d$/.test(prev) && /^\d{3}(\D|$)/.test(piece);
    if (prev !== undefined && (unclosed || thousands)) {
      out[out.length - 1] = thousands ? `${prev},${piece}` : `${prev}, ${piece}`;
    } else out.push(piece);
  }
  return out;
}
